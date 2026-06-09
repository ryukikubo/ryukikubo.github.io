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
  ante: 0
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
  // そのストリートでまだベットが入っていない場合は1BBを最低ベットとする
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

function calculatePots(){
  if(!currentHand) return [];

  const totals = getPlayerTotalContributions();
  const contributions = totals
    .map((amount, player) => ({ player, amount }))
    .filter(c => c.amount > 0)
    .sort((a, b) => a.amount - b.amount);

  const hasAllIn = contributions.some(c => players[c.player].stack === 0);
  if(!hasAllIn){
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

  while(remaining.length > 0){
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

function areAllActivePlayersAllIn(){
  if(!currentHand) return false;
  const active = getActivePlayerIndices();
  if(active.length === 0) return false;
  return active.every(i => players[i].stack === 0);
}

function handlePostAction(){
  if(!currentHand || currentHand.finished) return;

  const lastAction = currentHand.actions[currentHand.actions.length - 1];
  if(lastAction){
    if(lastAction.player === currentHand.streetStarter){
      currentHand.streetStarterHasActed = true;
    }
    if(lastAction.type === "fold" && lastAction.player === currentHand.streetStarter){
      currentHand.streetStarter = getNextActivePlayer((currentHand.streetStarter + 1) % players.length);
      currentHand.streetStarterHasActed = false;
    }
  }

  if(areAllActivePlayersAllIn()){
    currentPlayerIndex = null;
    openDistributionModal();
    return;
  }

  const nextIndex = getNextActivePlayer((currentPlayerIndex + 1) % players.length);

  if(shouldAdvanceStreet(nextIndex)){
    if(currentHand.street === "river"){
      currentPlayerIndex = null;
      openDistributionModal();
      return;
    }
    advanceStreet();
  } else {
    currentPlayerIndex = nextIndex;
  }
}

$(document).on("input", ".distribution-amount", updateDistributionRemaining);

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

function streetHasAction(){
  if(!currentHand) return false;
  return currentHand.actions.some(a => a.street === currentHand.street);
}

function getCurrentStreetStarter(){
  if(!currentHand || currentHand.streetStarter == null) return null;
  return getNextActivePlayer(currentHand.streetStarter);
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

function shouldAdvanceStreet(nextIndex){
  if(!currentHand || currentHand.streetStarter == null || !streetHasAction() || !currentHand.streetStarterHasActed || !isStreetBalanced()){
    return false;
  }

  if(currentHand.lastAggressor != null){
    return nextIndex === currentHand.lastAggressor;
  }

  return nextIndex === getCurrentStreetStarter();
}

/* ===== 描画 ===== */
function render(){

  
  $("#sb").text(gameSetting.sb || "-");
  $("#bb").text(gameSetting.bb || "-");
  $("#ante").text(gameSetting.ante || "-");

  $("#playerList").empty();
  $("#pot").text(currentHand ? currentHand.pot.toLocaleString() : 0);

  const currentStreet = currentHand ? currentHand.street : "-";
  const streetChanged = currentHand && currentHand.street && currentHand.street !== lastStreet;
  $("#street").text(currentStreet);
  if(streetChanged){
    $("#street").addClass("street-change");
    if(streetAnimationTimer){
      clearTimeout(streetAnimationTimer);
    }
    streetAnimationTimer = setTimeout(() => {
      $("#street").removeClass("street-change");
      streetAnimationTimer = null;
    }, 800);
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
      if(i === getSB()) pos = "SB";
      if(i === getBB()) pos = "BB";
    }

    let logs = "";
    let lastActionLabel = "";
    const folded = isFolded(i);
    const allIn = isPlayerAllIn(i);
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
          const amountText = lastAction.amount ? ` ${lastAction.amount}` : "";
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
            logs += `<div class="action-log">${a.type} ${a.amount || ""}</div>`;
          });
          logs += `</div>`;
        }
      });
    }

    // ✅ 現在プレイヤーか判定
    const delta = currentHand && currentHand.startStacks ? stack - (currentHand.startStacks[i] ?? 0) : 0;
    const showNegativeDelta = currentHand && currentHand.finished;
    const deltaLabel = delta === 0 ? "" : `${delta > 0 ? "+" : showNegativeDelta ? "" : ""}${delta > 0 || showNegativeDelta ? delta : ""}`;
    const deltaClass = delta > 0 ? "delta-positive" : delta < 0 && showNegativeDelta ? "delta-negative" : "";
    const isActive = (i === currentPlayerIndex && !folded && stack > 0 && !(currentHand && currentHand.finished));

    // ✅ アクションパネル（アクティブのみ）
    let actionPanel = "";
    if(isActive){
      const canCheck = !isFacingBet(i);
      const callAmount = getCallAmount(i);
      // If call amount exceeds player's stack, only allow All-in or Fold
      const limitedByStack = callAmount > stack;
      actionPanel = `
        <div class="action-panel">
          <button class="action-btn" data-type="check" data-i="${i}" ${canCheck && !limitedByStack ? "" : "disabled"}>Check</button>
          <button class="action-btn" data-type="call" data-i="${i}" ${limitedByStack ? "disabled" : ""}>Call</button>

          <div class="bet-row">
            <input type="number" class="bet-input" id="bet-${i}" placeholder="bet" ${limitedByStack ? "disabled" : ""}>
            <button class="action-btn bet-btn" data-type="bet" data-i="${i}" ${limitedByStack ? "disabled" : ""}>Bet</button>
            <button class="action-btn bet-btn" data-type="all-in" data-i="${i}">All-in</button>
          </div>

          <button class="action-btn fold-btn" data-type="fold" data-i="${i}">Fold</button>
        </div>
      `;
    }

    $("#playerList").append(`
      <li class="player-card ${folded ? "folded-player" : ""} ${allIn ? "all-in-player" : ""} ${isActive ? "active-player" : ""}">

        <div class="player-header">
          <span>${p.name}${allIn ? `<strong class="all-in-label"> [all in - ${allInAmount.toLocaleString()}]</strong>` : ''}</span>
          <span class="player-meta">
            <span class="player-pos">${pos}</span>
            <span class="player-action">${lastActionLabel}</span>
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


/* ===== SB / BB ===== */
function getSB(){
  if(players.length === 2) return dealerIndex; // Heads-up: SB = BTN
  if(players.length < 2) return 0;
  return (dealerIndex + 1) % players.length;
}

function getBB(){
  if(players.length === 2) return (dealerIndex + 1) % players.length; // Heads-up: BB = non-BTN
  if(players.length < 3) return getSB();
  return (dealerIndex + 2) % players.length;
}

/* ===== Add Player（モーダル） ===== */
$("#addPlayerBtn").click(()=>{
  $("#playerModal").show();
});

$("#savePlayer").click(()=>{

  const name = $("#playerName").val();
  const stack = parseInt($("#playerStack").val());

  if(!name || isNaN(stack)){
    alert("入力不正");
    return;
  }

  players.push({
    name,
    stack
  });

  // リセット入力欄
  $("#playerName").val("");
  $("#playerStack").val("");

  $("#playerModal").hide();

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

  if(isNaN(sb) || isNaN(bb)){
    alert("SB/BB必須");
    return;
  }

  gameSetting = { sb, bb, ante };

  console.log(gameSetting); // ★確認用（重要）

  $("#settingModal").hide();

  render(); // ← これ絶対必要
});



/* ===== Hand Start ===== */
$("#startGameBtn").on("click", ()=>{

  if(players.length < 2){
    alert("2人以上必要");
    return;
  }

  if(gameSetting.bb === 0){
    $("#settingModal").show();
    return;
  }

  $("#btnPlayer").empty();
  players.forEach((p, i)=>{
    $("#btnPlayer").append(`<option value="${i}">${p.name}</option>`);
  });

  $("#startModal").show();
});

/* ===== Action ===== */
$("#actionBtn").click(()=>{

  if(!currentHand){
    alert("hand開始してください");
    return;
  }

  $("#targetPlayer").empty();
  $("#streetType").val(currentHand.street || "preflop");

  players.forEach((p,i)=>{
    if(!isFolded(i) && p.stack > 0){
      $("#targetPlayer").append(`<option value="${i}">${p.name}</option>`);
    }
  });

  if(!$("#targetPlayer").children().length){
    alert("アクション可能なプレイヤーがいません。次のゲームを開始してください。");
    return;
  }

  $("#actionModal").show();
});

$("#nextStreetBtn").click(()=>{
  if(!currentHand){
    alert("hand開始してください");
    return;
  }

  if(!advanceStreet()){
    alert("これ以上のストリートはありません。");
    return;
  }

  render();
});

$("#addAction").click(()=>{

  const idx = parseInt($("#targetPlayer").val());
  let type = $("#actionType").val();
  let amount = parseInt($("#actionAmount").val()) || 0;
  const street = $("#streetType").val();

  if(type === "all-in"){
    amount = players[idx].stack;
  }

  const currentStreetMax = getCurrentStreetBetAmount();
  if(type === "call"){
    amount = getCallAmount(idx);
    if(amount === 0){
      type = "check";
    } else if(amount > players[idx].stack){
      // required call exceeds player's stack -> treat as all-in
      type = "all-in";
      amount = players[idx].stack;
    }
  }

  if((type === "bet" || type === "all-in") && amount > currentStreetMax){
    currentHand.lastAggressor = idx;
  }

  if(type !== "fold" && type !== "check" && amount <= 0){
    alert("有効な金額を入力してください。");
    return;
  }

  if(type === "bet"){
    const minBet = getMinimumBetAmount();
    if(amount < minBet){
      alert(`Betは最低 ${minBet} 以上にしてください。`);
      return;
    }
  }

  if(type === "all-in" && amount <= 0){
    alert("All-in できるスタックがありません。");
    return;
  }

  let p = players[idx];

  if(type === "fold"){
    if(!currentHand.foldedPlayers.includes(idx)){
      currentHand.foldedPlayers.push(idx);
    }
  } else {
    // preflopでbet/all-inの場合、既に支払ったブラインドを差し引く
    let actualAmount = amount;
    if(currentHand.street === "preflop" && (type === "bet" || type === "all-in")){
      const currentContributions = getStreetContributions("preflop");
      const playerContribution = currentContributions[idx] || 0;
      actualAmount = Math.max(0, amount - playerContribution);
    }
    
    p.stack -= actualAmount;
    currentHand.pot += actualAmount;
    amount = actualAmount; // アクション記録時に実際の支払額を使用
  }

  currentHand.actions.push({
    player: idx,
    type,
    amount,
    street
  });

  updateHandPots();
  settleHand();  handlePostAction();
  $("#actionAmount").val("");

  $("#actionModal").hide();
  render();
});

$(document).on("click", ".action-btn", function(){

  const idx = parseInt($(this).data("i"));
  if(isFolded(idx)){
    alert("このプレイヤーはフォールド済みです。");
    return;
  }

  let type = $(this).data("type");

  let amount = 0;

  if(type === "all-in"){
    amount = players[idx].stack;
  }

  const currentStreetMax = getCurrentStreetBetAmount();
  if(type === "bet"){
    amount = parseInt($(`#bet-${idx}`).val()) || 0;
    const minBet = getMinimumBetAmount();
    if(amount < minBet){
      alert(`Betは最低 ${minBet} 以上にしてください。`);
      return;
    }
  }

  if(type === "call"){
    amount = getCallAmount(idx);
    if(amount === 0){
      type = "check";
    } else if(amount > players[idx].stack){
      // required call exceeds player's stack -> treat as all-in
      type = "all-in";
      amount = players[idx].stack;
    }
  }

  if((type === "bet" || type === "all-in") && amount > currentStreetMax){
    currentHand.lastAggressor = idx;
  }

  if(type !== "fold" && type !== "check" && amount <= 0){
    alert("有効な金額を入力してください。");
    return;
  }

  if(type === "all-in" && amount <= 0){
    alert("All-in できるスタックがありません。");
    return;
  }

  if(type === "fold"){
    if(!currentHand.foldedPlayers.includes(idx)){
      currentHand.foldedPlayers.push(idx);
    }
  }

  if(type === "bet" || type === "call" || type === "all-in"){
    // preflopでbet/all-inの場合、既に支払ったブラインドを差し引く
    let actualAmount = amount;
    if(currentHand.street === "preflop" && (type === "bet" || type === "all-in")){
      const currentContributions = getStreetContributions("preflop");
      const playerContribution = currentContributions[idx] || 0;
      actualAmount = Math.max(0, amount - playerContribution);
    }
    
    players[idx].stack -= actualAmount;
    currentHand.pot += actualAmount;
    amount = actualAmount; // アクション記録時に実際の支払額を使用
  }

  currentHand.actions.push({
    player: idx,
    type,
    amount,
    street: currentHand.street || "preflop"
  });

  updateHandPots();
  settleHand();
  handlePostAction();

  render();
});

$("#startGame").click(()=>{

  const btn = parseInt($("#btnPlayer").val());

  if(isNaN(btn)){
    alert("BTN選択してください");
    return;
  }

  if(gameSetting.bb === 0){
    alert("Game Settingしてください");
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
      preflop: players.map(() => 0)
    },
    streetStarterHasActed: false,
    lastAggressor: null
  };

  const sbIdx = getSB();
  const bbIdx = getBB();

  players[sbIdx].stack -= gameSetting.sb;
  players[bbIdx].stack -= gameSetting.bb;

  currentHand.initialContributions.preflop[sbIdx] = gameSetting.sb;
  currentHand.initialContributions.preflop[bbIdx] = gameSetting.bb;
  currentHand.pot += gameSetting.sb + gameSetting.bb;
  currentPlayerIndex = getUTG();
  currentHand.streetStarter = currentPlayerIndex;
  updateHandPots();

  render();
  $("#startModal").hide();
});

$("#nextGameBtn").click(()=>{
  if(!currentHand || !currentHand.finished){
    alert("次ゲームは現在の手が終了してから開始してください。");
    return;
  }

  const nextDealer = getNextPlayerWithChips((dealerIndex + 1) % players.length);
  if(nextDealer == null){
    alert("次ゲームを開始できるプレイヤーがいません。");
    return;
  }

  dealerIndex = nextDealer;
  currentHand = {
    street: "preflop",
    pot: 0,
    actions: [],
    foldedPlayers: [],
    startStacks: players.map(p => p.stack),
    initialContributions: {
      preflop: players.map(() => 0)
    },
    streetStarterHasActed: false,
    lastAggressor: null
  };

  const sbIdx = getSB();
  const bbIdx = getBB();

  players[sbIdx].stack -= gameSetting.sb;
  players[bbIdx].stack -= gameSetting.bb;

  currentHand.initialContributions.preflop[sbIdx] = gameSetting.sb;
  currentHand.initialContributions.preflop[bbIdx] = gameSetting.bb;
  currentHand.pot += gameSetting.sb + gameSetting.bb;
  currentPlayerIndex = getUTG();
  currentHand.streetStarter = currentPlayerIndex;
  updateHandPots();

  render();
});

/* ===== 折り畳み ===== */
$(document).on("click",".player-header",function(){
  $(this).next().slideToggle();
});

/* ===== Close ===== */
$(".close").click(()=>$(".modal").hide());

/* ===== 初期描画 ===== */
render();