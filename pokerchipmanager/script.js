/* ===== 状態（全部メモリだけ） ===== */
let players = [];
let dealerIndex = 0;
let currentHand = null;
let currentPlayerIndex = null;
let lastStreet = null;
let streetAnimationTimer = null;

let gameSetting = {
  sb: 0,
  bb: 0,
  ante: 0,
  anteType: "all"
};

function getUTG(){
  if(players.length === 2) return dealerIndex; // Heads-up: preflop starts from SB (=BTN)
  return (dealerIndex + 3) % players.length;
}

function isFolded(playerIndex){
  return currentHand && currentHand.foldedPlayers.includes(playerIndex);
}

function canAct(playerIndex){
  return !isFolded(playerIndex) && players[playerIndex] && players[playerIndex].stack > 0;
}

function getNextActivePlayer(startIndex){
  if(!currentHand) return null;
  let idx = startIndex;
  for(let i = 0; i < players.length; i++){
    if(canAct(idx)) return idx;
    idx = (idx + 1) % players.length;
  }
  return null;
}

function getFirstActiveAfterDealer(){
  return getNextActivePlayer((dealerIndex + 1) % players.length);
}

function getNextPlayerWithChips(startIndex){
  let idx = startIndex;
  for(let i = 0; i < players.length; i++){
    if(players[idx].stack > 0) return idx;
    idx = (idx + 1) % players.length;
  }
  return null;
}

function getStreetContributions(street){
  const contributions = currentHand && currentHand.initialContributions && currentHand.initialContributions[street]
    ? [...currentHand.initialContributions[street]]
    : players.map(() => 0);
  if(!currentHand) return contributions;

  currentHand.actions
    .filter(a => (a.street || "preflop") === street)
    .forEach(a => {
      contributions[a.player] += a.amount || 0;
    });

  return contributions;
}

function getCurrentStreetBetAmount(){
  if(!currentHand) return 0;
  const street = currentHand.street || "preflop";
  const contributions = getStreetContributions(street);
  return Math.max(0, ...contributions);
}

function getMinimumBetAmount(){
  const currentMax = getCurrentStreetBetAmount();
  const base = gameSetting.bb || 0;
  if(currentMax === 0){
    return base;
  }
  return currentMax * 2;
}

function getCallAmount(playerIndex){
  if(!currentHand) return 0;
  const street = currentHand.street || "preflop";
  const contributions = getStreetContributions(street);
  const maxContribution = Math.max(0, ...contributions);
  return Math.max(0, maxContribution - (contributions[playerIndex] || 0));
}

function getPlayerTotalContributions(){
  if(!currentHand) return players.map(() => 0);
  const totals = players.map(() => 0);

  if(currentHand.initialContributions){
    Object.values(currentHand.initialContributions).forEach(arr => {
      arr.forEach((amt, idx) => {
        totals[idx] += amt || 0;
      });
    });
  }

  currentHand.actions.forEach(action => {
    totals[action.player] += action.amount || 0;
  });

  return totals;
}

function calculatePots() {
  if (!currentHand) return [];

  const totals = getPlayerTotalContributions();
  const active = getActivePlayerIndices();

  // ゲーム中、かつ誰もオールインしていない通常時は全額をメインポット1つにまとめる
  const hasAllInPlayer = active.some(idx => isPlayerAllIn(idx));
  if (!currentHand.finished && !hasAllInPlayer) {
    return [{
      amount: totals.reduce((sum, amt) => sum + amt, 0),
      eligiblePlayers: [...active],
      threshold: 0
    }];
  }

  const contributions = totals
    .map((amount, player) => ({ player, amount }))
    .filter(c => c.amount > 0)
    .sort((a, b) => a.amount - b.amount);

  if (active.length <= 2) {
    return [{
      amount: contributions.reduce((sum, c) => sum + c.amount, 0),
      eligiblePlayers: contributions
        .filter(c => !currentHand.foldedPlayers.includes(c.player))
        .map(c => c.player),
      threshold: 0
    }];
  }

  const pots = [];
  let remaining = contributions.map(c => ({ ...c }));

  while (remaining.length > 0) {
    const smallest = remaining[0].amount;
    const potAmount = smallest * remaining.length;

    const eligiblePlayers = remaining
      .filter(r => !currentHand.foldedPlayers.includes(r.player))
      .map(r => r.player);

    pots.push({
      amount: potAmount,
      eligiblePlayers,
      threshold: smallest
    });

    remaining = remaining
      .map(r => ({ player: r.player, amount: r.amount - smallest }))
      .filter(r => r.amount > 0);
  }

  return pots;
}

function updateHandPots(){
  if(!currentHand) return;
  currentHand.pots = calculatePots();
  currentHand.pot = currentHand.pots.reduce((sum, pot) => sum + pot.amount, 0);
}

function isFacingBet(playerIndex){
  return getCallAmount(playerIndex) > 0;
}

function advanceStreet(){
  const nextStreet = {
    preflop: "flop",
    flop: "turn",
    turn: "river"
  };

  if(!currentHand || currentHand.street === "river") return false;

  currentHand.street = nextStreet[currentHand.street] || "flop";
  currentPlayerIndex = getFirstActiveAfterDealer();
  currentHand.streetStarter = currentPlayerIndex;
  currentHand.streetStarterHasActed = false;
  currentHand.lastAggressor = null;
  return true;
}

/* ★ 修正: ショーダウンなし（降ろし勝ち）でも正しく終了状態にしてポットを渡す */
function settleHand(){
  if(!currentHand) return;
  const activePlayers = players
    .map((p, i) => ({index:i, folded:isFolded(i)}))
    .filter(p => !p.folded)
    .map(p => p.index);

  if(activePlayers.length !== 1) return;

  const winner = activePlayers[0];
  players[winner].stack += currentHand.pot;
  currentHand.winner = winner;
  currentHand.finished = true;
  currentHand.pot = 0;
  currentPlayerIndex = null;
}

function getActivePlayerIndices(){
  if(!currentHand) return [];
  return players
    .map((p, i) => i)
    .filter(i => !isFolded(i));
}

function isPlayerAllIn(playerIndex){
  if(!currentHand) return false;
  return currentHand.actions.some(a => a.player === playerIndex && a.type === "all-in");
}

function getPlayerAllInAmount(playerIndex){
  if(!currentHand) return 0;
  return currentHand.actions
    .filter(a => a.player === playerIndex && a.type === "all-in")
    .reduce((sum, a) => sum + (a.amount || 0), 0);
}

function buildDistributionInputs(){
  if(!currentHand) return;

  updateHandPots();
  const contributions = getPlayerTotalContributions();
  const activePlayerIndices = getActivePlayerIndices();
  const container = $("#distributionList");
  container.empty();

  let breakdownHtml = "0";
  if(currentHand.pots && currentHand.pots.length === 1){
    breakdownHtml = currentHand.pots[0].amount.toLocaleString();
  } else if(currentHand.pots && currentHand.pots.length > 1){
    breakdownHtml = currentHand.pots
      .map((pot, idx) => {
        const label = idx === 0 ? "Main Pot" : `Side Pot ${idx}`;
        const eligible = pot.eligiblePlayers.map(i => players[i].name).join(", ") || "No eligible";
        return `${label}: ${pot.amount.toLocaleString()} (${eligible})`;
      })
      .join("<br>");
  }

  $("#distributionBreakdown").html(breakdownHtml || "0");
  $("#distributionTotal").text(currentHand.pot.toLocaleString());

  activePlayerIndices.forEach(idx => {
    const contribution = contributions[idx] || 0;
    container.append(`
      <div class="form-group distribution-row">
        <label>${players[idx].name} bet:${contribution.toLocaleString()}</label>
        <input type="number" min="0" class="distribution-amount" data-player="${idx}" value="0">
      </div>
    `);
  });

  updateDistributionRemaining();
}

function updateDistributionRemaining(){
  if(!currentHand) return;
  const total = currentHand.pot;
  let assigned = 0;
  $(".distribution-amount").each(function(){
    assigned += parseInt($(this).val()) || 0;
  });
  const remaining = total - assigned;
  $("#distributionRemaining").text(remaining.toLocaleString());
  $("#distributionRemaining").toggleClass("negative", remaining !== 0);
}

function openDistributionModal(){
  buildDistributionInputs();
  $("#distributionModal").show();
}

function isStreetBalanced(){
  if(!currentHand) return false;
  const street = currentHand.street || "preflop";
  const contributions = getStreetContributions(street);
  const maxContribution = Math.max(0, ...contributions);

  return players.every((p, i) => {
    if(isFolded(i)) return true;
    const playerContribution = contributions[i] || 0;
    return playerContribution === maxContribution || players[i].stack === 0;
  });
}

function handlePostAction() {
  if (!currentHand || currentHand.finished) return;

  const active = getActivePlayerIndices();
  const aliveWithChips = active.filter(i => players[i].stack > 0);

  if (active.length === 1) {
    settleHand();
    render();
    return;
  }

  if (isStreetBalanced() && aliveWithChips.length <= 1) {
    while (currentHand.street !== "river") {
      advanceStreet();
    }
    currentPlayerIndex = null;
    openDistributionModal();
    render();
    return;
  }

  const lastAction = currentHand.actions[currentHand.actions.length - 1];

  if (lastAction) {
    if (lastAction.player === currentHand.streetStarter) {
      currentHand.streetStarterHasActed = true;
    }
    if (lastAction.type === "fold" && lastAction.player === currentHand.streetStarter) {
      currentHand.streetStarter = getNextActivePlayer((currentHand.streetStarter + 1) % players.length);
      currentHand.streetStarterHasActed = false;
    }
  }

  const nextIndex = getNextActivePlayer((currentPlayerIndex + 1) % players.length);

  if (isStreetBalanced() && nextIndex === currentHand.streetStarter) {
    if (currentHand.street === "river") {
      currentPlayerIndex = null;
      openDistributionModal();
      return;
    }

    advanceStreet();
    currentPlayerIndex = getFirstActiveAfterDealer();
    currentHand.streetStarter = currentPlayerIndex;
    currentHand.streetStarterHasActed = false;

    render();
    return;
  }

  currentPlayerIndex = nextIndex;
  render();
}

$(document).on("input", ".distribution-amount", updateDistributionRemaining);

/* ===== SB / BB ポジション計算ルール ===== */
function getSB() {
  if (players.length === 2) return dealerIndex;
  return getNextPlayerWithChips((dealerIndex + 1) % players.length);
}

function getBB() {
  if (players.length === 2) return getNextPlayerWithChips((dealerIndex + 1) % players.length);
  const next = getNextPlayerWithChips((dealerIndex + 1) % players.length);
  return getNextPlayerWithChips((next + 1) % players.length);
}

/* ===== 描画 (Render) ===== */
function render(){
  $("#sb").text(gameSetting.sb || "-");
  $("#bb").text(gameSetting.bb || "-");
  $("#ante").text(gameSetting.ante || "-");

  $("#playerList").empty();
  $("#pot").text(currentHand ? currentHand.pot.toLocaleString() : 0);

  const currentStreet = currentHand ? currentHand.street : "-";
  const streetChanged = currentHand && currentHand.street && currentHand.street !== lastStreet;
  
  $("#street").text(currentStreet.toUpperCase());
  $("#street").removeClass("st-preflop st-flop st-turn st-river st-none");

  if (!currentHand) {
    $("#street").addClass("st-none");
  } else {
    $("#street").addClass("st-" + currentHand.street);
  }
  
  if (streetChanged) {
    $("#street").removeClass("street-change-animation");
    void $("#street")[0].offsetWidth; 
    $("#street").addClass("street-change-animation");
  }
  lastStreet = currentHand ? currentHand.street : null;

  $("#nextGameBtn").prop("disabled", !currentHand || !currentHand.finished);

  if(currentHand && !currentHand.finished){
    updateHandPots();
  }

  let potHtml = "0";
  if(currentHand && currentHand.pots && currentHand.pots.length === 1){
    potHtml = currentHand.pots[0].amount.toLocaleString();
  } else if(currentHand && currentHand.pots && currentHand.pots.length > 1){
    potHtml = currentHand.pots.map((pot, idx) => {
        const label = idx === 0 ? "Main Pot" : `Side Pot ${idx}`;
        const eligible = pot.eligiblePlayers.map(i => players[i].name).join(", ") || "No eligible";
        return `${label}: ${pot.amount.toLocaleString()} (${eligible})`;
      }).join("<br>");
  }

  $("#pot").html(potHtml);

  players.forEach((p, i) => {
    const stack = p.stack ?? 0;

    let pos = "";
    if(currentHand && players.length > 1){
      if(i === dealerIndex) pos = "D";
      else if(i === getSB()) pos = "SB";
      else if(i === getBB()) pos = "BB";
    }

    let logs = "";
    let lastActionLabel = "";
    const folded = isFolded(i);
    const allIn = isPlayerAllIn(i);
    const out = (stack === 0 && !folded && !allIn);
    const allInAmount = getPlayerAllInAmount(i);

    if(currentHand){
      const streetNames = {
        preflop: "Preflop",
        flop: "Flop",
        turn: "Turn",
        river: "River"
      };

      const playerActions = currentHand.actions.filter(a => a.player === i);
      const currentStreet = currentHand.street || "preflop";
      const streetActions = playerActions.filter(a => (a.street || "preflop") === currentStreet);
      const lastAction = streetActions[streetActions.length - 1];
      if(lastAction){
        if(lastAction.type === "all-in"){
          lastActionLabel = `all in - ${(lastAction.amount || 0).toLocaleString()}`;
        } else {
          let amt = lastAction.amount;
          if (amt === 0 && (lastAction.type === "sb" || lastAction.type === "bb")) {
            amt = lastAction.type === "sb" ? gameSetting.sb : gameSetting.bb;
          }
          const amountText = amt ? ` ${amt}` : "";
          lastActionLabel = `${lastAction.type}${amountText}`;
        }
      }

      const actionsByStreet = playerActions
        .reduce((acc, a) => {
          const street = a.street || "preflop";
          acc[street] = acc[street] || [];
          acc[street].push(a);
          return acc;
        }, {});

      ["preflop", "flop", "turn", "river"].forEach((street) => {
        const list = actionsByStreet[street];
        if(list && list.length){
          logs += `<div class="street-group"><div class="street-header">${streetNames[street]}</div>`;
          list.forEach(a => {
            let amt = a.amount;
            if (amt === 0 && (a.type === "sb" || a.type === "bb")) {
              amt = a.type === "sb" ? gameSetting.sb : gameSetting.bb;
            }
            logs += `<div class="action-log">${a.type} ${amt || ""}</div>`;
          });
          logs += `</div>`;
        }
      });
    }

    /* ★ 修正: 終了時 (currentHand.finished) であれば、ショーダウンしていなくても差額 (Delta) を計算して表示 */
    const delta = currentHand && currentHand.startStacks ? stack - (currentHand.startStacks[i] ?? 0) : 0;
    const showDelta = currentHand && currentHand.finished && delta !== 0; 
    const deltaLabel = showDelta ? `${delta > 0 ? "+" : ""}${delta}` : "";
    const deltaClass = delta > 0 ? "delta-positive" : delta < 0 && showDelta ? "delta-negative" : "";
    
    const isActive = (i === currentPlayerIndex && !folded && stack > 0 && !(currentHand && currentHand.finished));

    let actionPanel = "";
    if(isActive){
      const canCheck = !isFacingBet(i);
      const callAmount = getCallAmount(i);
      const limitedByStack = callAmount > stack;
      actionPanel = `
        <div class="action-panel">
          <button class="action-btn check-btn" data-type="check" data-i="${i}" ${canCheck && !limitedByStack ? "" : "disabled"}>Check</button>
          <button class="action-btn call-btn" data-type="call" data-i="${i}" ${limitedByStack ? "disabled" : ""}>Call</button>

          <div class="bet-row">
            <input type="number" class="bet-input" id="bet-${i}" placeholder="bet" ${limitedByStack ? "disabled" : ""}>
            <button class="action-btn bet-btn raise-btn" data-type="bet" data-i="${i}" ${limitedByStack ? "disabled" : ""}>Bet</button>
            <button class="action-btn bet-btn all-in-btn" data-type="all-in" data-i="${i}">All-in</button>
          </div>

          <button class="action-btn fold-btn" data-type="fold" data-i="${i}">Fold</button>
        </div>
      `;
    }

    $("#playerList").append(`
      <li class="player-card ${folded ? "folded-player" : ""} ${allIn ? "all-in-player" : ""} ${out ? "out-player" : ""} ${isActive ? "active-player" : ""}">

        <div class="player-header">
          <span>${p.name}${allIn ? `<strong class="all-in-label"> [all in - ${allInAmount.toLocaleString()}]</strong>` : ''}</span>
          <span class="player-meta">
            <span class="player-pos">${pos || "-"}</span>
            <span class="player-action">${lastActionLabel || "-"}</span>
            <span class="player-delta ${deltaClass}">${deltaLabel}</span>
          </span>
          <span>${stack.toLocaleString()}</span>
        </div>

        <div class="action-list">
          ${logs || "<div class='no-action'>No action</div>"}
        </div>

        ${actionPanel}

      </li>
    `);
  });
}

/* ===== Add Player (ゲーム状況別のモーダル分岐) ===== */
$("#addPlayerBtn").click(()=>{
  if (currentHand) {
    const insertSelect = $("#insertAfterPlayer");
    insertSelect.empty();
    
    players.forEach((p, i) => {
      insertSelect.append(`<option value="${i}">${p.name}</option>`);
    });
    
    $("#playerModalGameInProgress").show();
  } else {
    $("#playerModal").show();
  }
});

$("#savePlayer").click(()=>{
  const name = $("#playerName").val();
  const stack = parseInt($("#playerStack").val());

  if(!name || isNaN(stack)){
    alert("入力不正");
    return;
  }

  players.push({ name, stack });
  $("#playerName").val("");
  $("#playerStack").val("");
  $("#playerModal").hide();
  render();
});

/* ===== ゲーム進行中のPlayer割り込み追加＆補正ロジック ===== */
$("#savePlayerGameInProgress").click(() => {
  const name = $("#playerNameGameInProgress").val();
  const stack = parseInt($("#playerStackGameInProgress").val());
  const afterIdx = parseInt($("#insertAfterPlayer").val());

  if (!name || isNaN(stack) || isNaN(afterIdx)) {
    alert("入力が不正です");
    return;
  }

  const insertIdx = afterIdx + 1;
  const newPlayer = { name, stack };

  players.splice(insertIdx, 0, newPlayer);

  if (dealerIndex >= insertIdx) {
    dealerIndex++;
  }
  if (currentPlayerIndex !== null && currentPlayerIndex >= insertIdx) {
    currentPlayerIndex++;
  }

  if (currentHand) {
    if (currentHand.streetStarter !== null && currentHand.streetStarter >= insertIdx) {
      currentHand.streetStarter++;
    }
    if (currentHand.lastAggressor !== null && currentHand.lastAggressor >= insertIdx) {
      currentHand.lastAggressor++;
    }

    currentHand.foldedPlayers = currentHand.foldedPlayers.map(idx => {
      return idx >= insertIdx ? idx + 1 : idx;
    });

    if (currentHand.startStacks) {
      currentHand.startStacks.splice(insertIdx, 0, stack);
    }

    if (currentHand.initialContributions) {
      Object.keys(currentHand.initialContributions).forEach(street => {
        if (Array.isArray(currentHand.initialContributions[street])) {
          currentHand.initialContributions[street].splice(insertIdx, 0, 0);
        }
      });
    }

    if (currentHand.actions) {
      currentHand.actions.forEach(action => {
        if (action.player >= insertIdx) {
          action.player++;
        }
      });
    }
  }

  $("#playerNameGameInProgress").val("");
  $("#playerStackGameInProgress").val("");
  $("#playerModalGameInProgress").hide();

  render();
});

/* ===== Game Setting ===== */
$("#settingBtn").click(()=>{
  $("#settingModal").show();
});

$("#saveSetting").click(()=>{
  const sb = parseInt($("#sbValue").val());
  const bb = parseInt($("#bbValue").val());
  const ante = parseInt($("#anteValue").val()) || 0;
  const anteType = $("#anteType").val() || "all";

  if(isNaN(sb) || isNaN(bb)){
    alert("SB/BB必須");
    return;
  }

  gameSetting = { sb, bb, ante, anteType };
  $("#settingModal").hide();
  render();
});

/* ===== Start Game ボタン ===== */
$("#startGameBtn").on("click", function(){
  if(players.length < 2){
    alert("2人以上必要");
    return;
  }

  if(gameSetting.bb === 0){
    alert("先にGame Settingを行ってください。");
    $("#settingModal").show();
    return;
  }

  $("#btnPlayer").empty();
  players.forEach((p, i)=>{
    $("#btnPlayer").append(`<option value="${i}">${p.name} (${p.stack.toLocaleString()})</option>`);
  });

  $("#startModal").show();
});

/* ===== ゲーム開始処理 ===== */
$("#startGame").click(function(){
  const btn = parseInt($("#btnPlayer").val());

  if(isNaN(btn) || btn < 0 || btn >= players.length){
    alert("BTN選択してください");
    return;
  }

  dealerIndex = btn;

  currentHand = {
    street: "preflop",
    pot: 0,
    actions: [],
    foldedPlayers: [],
    startStacks: players.map(p => p.stack),
    initialContributions: {
      preflop: players.map(() => 0),
      flop: players.map(() => 0),
      turn: players.map(() => 0),
      river: players.map(() => 0)
    },
    streetStarterHasActed: false,
    lastAggressor: null
  };

  const sbIdx = getSB();
  const bbIdx = getBB();

  /* SB 徴収 */
  if (sbIdx !== null && players[sbIdx].stack > 0) {
    const sbToTake = Math.min(gameSetting.sb, players[sbIdx].stack);
    const isAllIn = sbToTake < gameSetting.sb;

    players[sbIdx].stack -= sbToTake;
    currentHand.initialContributions.preflop[sbIdx] = sbToTake;
    currentHand.pot += sbToTake;
    
    currentHand.actions.push({
      player: sbIdx,
      type: isAllIn ? "all-in" : "sb",
      amount: isAllIn ? sbToTake : 0,
      street: "preflop"
    });
  }

  /* BB 徴収 */
  if (players[bbIdx].stack > 0) {
    const bbToTake = Math.min(gameSetting.bb, players[bbIdx].stack);
    const isAllIn = bbToTake < gameSetting.bb;

    players[bbIdx].stack -= bbToTake;
    currentHand.initialContributions.preflop[bbIdx] = bbToTake;
    currentHand.pot += bbToTake;
    
    currentHand.actions.push({
      player: bbIdx,
      type: isAllIn ? "all-in" : "bb",
      amount: isAllIn ? bbToTake : 0,
      street: "preflop"
    });
  }

  /* Ante 徴収 */
  if (gameSetting.ante > 0) {
    if (gameSetting.anteType === "all") {
      players.forEach((p, i) => {
        if (p.stack > 0) {
          const anteToTake = Math.min(gameSetting.ante, p.stack);
          p.stack -= anteToTake;
          currentHand.initialContributions.preflop[i] += anteToTake;
          currentHand.pot += anteToTake;
        }
      });
    } else if (gameSetting.anteType === "bb") {
      if (players[bbIdx].stack > 0) {
        const anteToTake = Math.min(gameSetting.ante, players[bbIdx].stack);
        players[bbIdx].stack -= anteToTake;
        currentHand.initialContributions.preflop[bbIdx] += anteToTake;
        currentHand.pot += anteToTake;
      }
    }
  }

  currentPlayerIndex = getUTG();
  currentHand.streetStarter = currentPlayerIndex;
  updateHandPots();

  $("#startModal").hide();
  render();
});

/* ===== Action Buttons コアロジック ===== */
$(document).on("click", ".action-btn", function () {
  const idx = parseInt($(this).data("i"));
  if (isFolded(idx)) return;

  let type = $(this).data("type");
  let amount = 0;
  const player = players[idx];
  const street = currentHand.street || "preflop";
  const currentStreetMax = getCurrentStreetBetAmount();
  const callAmount = getCallAmount(idx);

  if (type === "fold") {
    if (!currentHand.foldedPlayers.includes(idx)) {
      currentHand.foldedPlayers.push(idx);
    }
    currentHand.actions.push({ player: idx, type, amount: 0, street });
    updateHandPots();
    settleHand();
    handlePostAction();
    render();
    return;
  }

  if (type === "check" || type === "call") {
    if (callAmount === 0) {
      type = "check";
      amount = 0;
    } else {
      if (callAmount >= player.stack) {
        type = "all-in";
        amount = player.stack;
      } else {
        type = "call";
        amount = callAmount;
      }
    }
  }

  if (type === "bet" || type === "all-in") {
    let inputVal = parseInt($(`#bet-${idx}`).val()) || 0;

    if (type === "all-in") {
      inputVal = player.stack + getStreetContributions(street)[idx];
    }

    const currentContributions = getStreetContributions(street);
    const alreadyPaid = currentContributions[idx] || 0;
    amount = Math.max(0, inputVal - alreadyPaid);

    if (amount <= 0) {
      alert("有効な金額を入力してください。");
      return;
    }

    if (type === "bet") {
      const minBet = getMinimumBetAmount();
      if (inputVal < minBet) {
        alert(`Betは最低 ${minBet} 以上にしてください。`);
        return;
      }
    }

    if (amount >= player.stack) {
      type = "all-in";
      amount = player.stack;
    }

    if (inputVal > currentStreetMax) {
      currentHand.lastAggressor = idx;
    }
  }

  player.stack -= amount;
  currentHand.pot += amount;

  currentHand.actions.push({ player: idx, type, amount, street });

  updateHandPots();
  settleHand();
  handlePostAction();
  render();
});

/* ===== 精算の適用 ===== */
$("#applyDistribution").click(()=>{
  if(!currentHand) return;
  const total = currentHand.pot;
  const allocations = [];
  let sum = 0;

  $(".distribution-amount").each(function(){
    const amount = parseInt($(this).val()) || 0;
    const player = parseInt($(this).data("player"));
    allocations.push({ player, amount });
    sum += amount;
  });

  if(sum !== total){
    alert(`配分合計は pot と一致する必要があります。現在の pot: ${total}, 合計: ${sum}`);
    return;
  }

  allocations.forEach(a => {
    players[a.player].stack += a.amount;
  });

  currentHand.finished = true;
  currentHand.pot = 0;
  currentHand.pots = [];
  currentPlayerIndex = null;
  $("#distributionModal").hide();
  render();
});

/* ===== Next Game ===== */
$("#nextGameBtn").click(function(){
  if(!currentHand || !currentHand.finished) return;

  for (let i = players.length - 1; i >= 0; i--) {
    if (players[i].stack <= 0) {
      players.splice(i, 1);
    }
  }

  if (players.length < 2) {
    alert("アクティブなプレイヤーが2人未満になったため、次のゲームを開始できません。");
    currentHand = null;
    currentPlayerIndex = null;
    render();
    return;
  }

  dealerIndex = (dealerIndex + 1) % players.length;

  currentHand = {
    street: "preflop",
    pot: 0,
    actions: [],
    foldedPlayers: [],
    streetStarter: getUTG(),
    streetStarterHasActed: false,
    startStacks: players.map(p => p.stack), // ★ 修正: 次のハンド開始時にも初期スタックを保存
    initialContributions: {
      preflop: players.map(() => 0),
      flop: players.map(() => 0),
      turn: players.map(() => 0),
      river: players.map(() => 0)
    },
    finished: false
  };

  const sbIdx = getSB();
  const bbIdx = getBB();

  /* SB 徴収 */
  if (sbIdx !== null && players[sbIdx].stack > 0) {
    const sbToTake = Math.min(gameSetting.sb, players[sbIdx].stack);
    const isAllIn = sbToTake < gameSetting.sb;

    players[sbIdx].stack -= sbToTake;
    currentHand.initialContributions.preflop[sbIdx] = sbToTake;
    currentHand.pot += sbToTake;

    currentHand.actions.push({
      player: sbIdx,
      type: isAllIn ? "all-in" : "sb",
      amount: isAllIn ? sbToTake : 0,
      street: "preflop"
    });
  }

  /* BB 徴収 */
  if (players[bbIdx].stack > 0) {
    const bbToTake = Math.min(gameSetting.bb, players[bbIdx].stack);
    const isAllIn = bbToTake < gameSetting.bb;

    players[bbIdx].stack -= bbToTake;
    currentHand.initialContributions.preflop[bbIdx] = bbToTake;
    currentHand.pot += bbToTake;

    currentHand.actions.push({
      player: bbIdx,
      type: isAllIn ? "all-in" : "bb",
      amount: isAllIn ? bbToTake : 0,
      street: "preflop"
    });
  }

  /* Ante 徴収 */
  if (gameSetting.ante > 0) {
    if (gameSetting.anteType === "all") {
      players.forEach((p, i) => {
        if (p.stack > 0) {
          const anteToTake = Math.min(gameSetting.ante, p.stack);
          p.stack -= anteToTake;
          currentHand.initialContributions.preflop[i] += anteToTake;
          p.pot += anteToTake;
        }
      });
    } else if (gameSetting.anteType === "bb") {
      if (players[bbIdx].stack > 0) {
        const anteToTake = Math.min(gameSetting.ante, players[bbIdx].stack);
        players[bbIdx].stack -= anteToTake;
        currentHand.initialContributions.preflop[bbIdx] += anteToTake;
        currentHand.pot += anteToTake;
      }
    }
  }

  currentPlayerIndex = currentHand.streetStarter;
  render();
});

/* ===== 折り畳み & モーダルを閉じる各種イベント ===== */
$(document).on("click", ".player-header", function(){
  $(this).next().slideToggle();
});

$(".close").click(function(){
  $(this).closest(".modal").hide();
});

/* ===== 初期表示 ===== */
render();