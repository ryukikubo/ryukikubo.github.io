const initialDiceCount = 5;
const faceValues = [2, 3, 4, 5, 6];
const pipPositions = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8]
};

let playerCount = 2;
let players = [];
let game = null;
let selectedFace = 2;

const setupView = document.querySelector('#setupView');
const rulesView = document.querySelector('#rulesView');
const handoffView = document.querySelector('#handoffView');
const gameView = document.querySelector('#gameView');
const resultView = document.querySelector('#resultView');
const nameFields = document.querySelector('#playerNameFields');
const bidQuantity = document.querySelector('#bidQuantity');

function showView(view) {
  [setupView, rulesView, handoffView, gameView, resultView].forEach(section => {
    section.hidden = section !== view;
  });
  window.scrollTo(0, 0);
}

function renderNameFields(previousNames = []) {
  nameFields.replaceChildren();
  for (let index = 0; index < playerCount; index += 1) {
    const label = document.createElement('label');
    label.className = 'name-field';
    label.textContent = `PLAYER ${index + 1}`;

    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 16;
    input.autocomplete = 'off';
    input.value = previousNames[index] || `Player ${index + 1}`;
    input.dataset.playerName = String(index);
    input.setAttribute('aria-label', `プレイヤー${index + 1}の名前`);

    label.append(input);
    nameFields.append(label);
  }
}

function alivePlayerIndices() {
  return players.map((player, index) => player.diceCount > 0 ? index : -1).filter(index => index >= 0);
}

function nextAlivePlayerIndex(fromIndex) {
  for (let offset = 1; offset <= players.length; offset += 1) {
    const candidate = (fromIndex + offset) % players.length;
    if (players[candidate].diceCount > 0) return candidate;
  }
  return fromIndex;
}

function rollDice(count) {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1);
}

function totalDiceInPlay() {
  return players.reduce((total, player) => total + player.diceCount, 0);
}

function startMatch() {
  const inputs = [...nameFields.querySelectorAll('input')];
  const names = inputs.map((input, index) => input.value.trim() || `Player ${index + 1}`);

  players = names.map(name => ({ name, diceCount: initialDiceCount, dice: [] }));
  game = { round: 1, currentPlayerIndex: 0, currentBid: null, history: [], result: null };
  startRound(0);
}

function startRound(startIndex) {
  players.forEach(player => {
    player.dice = player.diceCount > 0 ? rollDice(player.diceCount) : [];
  });
  game.round += game.round === 1 && game.currentBid === null && game.history.length === 0 ? 0 : 1;
  game.currentBid = null;
  game.history = [];
  game.result = null;
  game.currentPlayerIndex = players[startIndex]?.diceCount > 0 ? startIndex : nextAlivePlayerIndex(startIndex);
  selectedFace = 2;
  bidQuantity.value = '1';
  renderHandoff();
}

function renderHandoff() {
  document.querySelector('#handoffRound').textContent = `ROUND ${game.round}`;
  document.querySelector('#handoffPlayerName').textContent = players[game.currentPlayerIndex].name;
  showView(handoffView);
}

function createDie(value, revealed = false) {
  const die = document.createElement('span');
  die.className = `die die-${value}${value === 1 ? ' is-wild' : ''}`;
  die.setAttribute('role', 'img');
  die.setAttribute('aria-label', `サイコロ ${value}${value === 1 && revealed ? '（ワイルド）' : ''}`);
  pipPositions[value].forEach(position => {
    const pip = document.createElement('span');
    pip.className = 'pip';
    pip.style.gridArea = `${Math.floor(position / 3) + 1} / ${(position % 3) + 1}`;
    die.append(pip);
  });
  return die;
}

function renderPlayerSeats() {
  const seats = document.querySelector('#playerSeats');
  seats.replaceChildren();
  const activeCount = alivePlayerIndices().length;
  document.querySelector('#activeCountLabel').textContent = `${activeCount} PLAYERS ACTIVE`;

  players.forEach((player, index) => {
    const seat = document.createElement('div');
    seat.className = `seat${player.diceCount === 0 ? ' is-eliminated' : ''}${index === game.currentPlayerIndex ? ' is-current' : ''}`;
    const name = document.createElement('span');
    name.className = 'seat-name';
    name.textContent = player.name;
    const count = document.createElement('span');
    count.className = 'seat-count';
    count.textContent = player.diceCount > 0 ? `${player.diceCount} dice` : 'OUT';
    seat.append(name, count);
    seats.append(seat);
  });
}

function isLegalBid(quantity, face) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > totalDiceInPlay()) return false;
  if (!faceValues.includes(face)) return false;
  if (!game.currentBid) return true;
  return quantity > game.currentBid.quantity || (quantity === game.currentBid.quantity && face > game.currentBid.face);
}

function suggestedBid() {
  if (!game.currentBid) return { quantity: 1, face: 2 };
  if (game.currentBid.face < 6) return { quantity: game.currentBid.quantity, face: game.currentBid.face + 1 };
  return { quantity: game.currentBid.quantity + 1, face: 2 };
}

function renderBidControls() {
  const maxDice = Math.max(1, totalDiceInPlay());
  bidQuantity.max = String(maxDice);
  if (Number(bidQuantity.value) > maxDice) bidQuantity.value = String(maxDice);
  document.querySelector('#quantityDown').disabled = Number(bidQuantity.value) <= 1;
  document.querySelector('#quantityUp').disabled = Number(bidQuantity.value) >= maxDice;

  document.querySelectorAll('.face-option').forEach(button => {
    const isSelected = Number(button.dataset.face) === selectedFace;
    button.classList.toggle('is-selected', isSelected);
    button.setAttribute('aria-pressed', String(isSelected));
  });

  const legal = isLegalBid(Number(bidQuantity.value), selectedFace);
  document.querySelector('#raiseButton').disabled = !legal;
  document.querySelector('#bidError').hidden = legal || !bidQuantity.value;
  document.querySelector('#bidError').textContent = game.currentBid
    ? '個数を増やすか、同じ個数なら目を上げてください。'
    : '場にあるダイス数以内で宣言してください。';
}

function renderHistory() {
  const historyList = document.querySelector('#bidHistory');
  historyList.replaceChildren();
  document.querySelector('#historyCount').textContent = String(game.history.length);

  game.history.slice().reverse().forEach((entry, index) => {
    const item = document.createElement('li');
    const player = document.createElement('span');
    player.className = 'history-player';
    player.textContent = entry.playerName;
    const bid = document.createElement('strong');
    bid.textContent = `${entry.quantity} × ${entry.face}`;
    item.className = index === 0 ? 'is-latest' : '';
    item.append(player, bid);
    historyList.append(item);
  });
}

function renderGame() {
  const currentPlayer = players[game.currentPlayerIndex];
  document.querySelector('#roundLabel').textContent = `ROUND ${game.round}`;
  document.querySelector('#currentPlayerName').textContent = currentPlayer.name;
  document.querySelector('#myDiceCount').textContent = `${currentPlayer.dice.length} DICE`;

  const diceTray = document.querySelector('#myDice');
  diceTray.replaceChildren(...currentPlayer.dice.map(value => createDie(value)));
  renderPlayerSeats();

  if (game.currentBid) {
    document.querySelector('#currentBid').innerHTML = `<strong>${game.currentBid.quantity}</strong><span>×</span><strong>${game.currentBid.face}</strong>`;
    document.querySelector('#bidHint').textContent = `${players[game.currentBid.playerIndex].name} の宣言`;
  } else {
    document.querySelector('#currentBid').textContent = 'まだ宣言はありません';
    document.querySelector('#bidHint').textContent = '最初の宣言をしてください';
  }

  document.querySelector('#challengeButton').disabled = !game.currentBid;
  renderBidControls();
  renderHistory();
  showView(gameView);
}

function addBid() {
  const quantity = Number(bidQuantity.value);
  if (!isLegalBid(quantity, selectedFace)) return;

  const playerIndex = game.currentPlayerIndex;
  game.currentBid = { quantity, face: selectedFace, playerIndex };
  game.history.push({ quantity, face: selectedFace, playerName: players[playerIndex].name });
  game.currentPlayerIndex = nextAlivePlayerIndex(playerIndex);
  const suggestion = suggestedBid();
  bidQuantity.value = String(suggestion.quantity);
  selectedFace = suggestion.face;
  renderHandoff();
}

function countMatchingDice(face) {
  return players.reduce((total, player) => {
    if (player.diceCount === 0) return total;
    return total + player.dice.filter(value => value === face || value === 1).length;
  }, 0);
}

function renderRevealedDice() {
  const list = document.querySelector('#revealedDice');
  list.replaceChildren();
  players.forEach((player, index) => {
    const row = document.createElement('div');
    row.className = `reveal-row${index === game.result.loserIndex ? ' is-loser' : ''}`;
    const label = document.createElement('div');
    label.className = 'reveal-label';
    const name = document.createElement('strong');
    name.textContent = player.name;
    const matchCount = document.createElement('span');
    matchCount.textContent = `${game.result.matchCounts[index]} matching`;
    label.append(name, matchCount);
    const dice = document.createElement('div');
    dice.className = 'dice-tray reveal-tray';
    player.dice.forEach(value => dice.append(createDie(value, true)));
    row.append(label, dice);
    list.append(row);
  });
}

function renderResult() {
  const result = game.result;
  const bid = result.bid;
  const bidder = players[bid.playerIndex];
  const challenger = players[result.challengerIndex];
  const loser = players[result.loserIndex];
  const winnerTitle = document.querySelector('#resultTitle');
  const summary = document.querySelector('#resultSummary');
  const continueButton = document.querySelector('#resultContinueButton');

  if (result.winnerIndex !== null) {
    winnerTitle.textContent = `${players[result.winnerIndex].name} の勝ち`;
    summary.textContent = `${bidder.name} の「${bid.quantity} × ${bid.face}」は${result.wasTrue ? '本当' : 'ブラフ'}。${challenger.name} がダウトしました。`;
    continueButton.textContent = '新しいゲーム';
  } else {
    winnerTitle.textContent = result.wasTrue ? '宣言は本当！' : 'ブラフ！';
    summary.textContent = `「${bid.quantity} × ${bid.face}」に対して実際は ${result.actualCount} 個。${loser.name} がダイスを1個失います。`;
    continueButton.textContent = '次のラウンドへ →';
  }

  renderRevealedDice();
  showView(resultView);
}

function callBluff() {
  if (!game.currentBid) return;
  const bid = game.currentBid;
  const challengerIndex = game.currentPlayerIndex;
  const actualCount = countMatchingDice(bid.face);
  const wasTrue = actualCount >= bid.quantity;
  const loserIndex = wasTrue ? challengerIndex : bid.playerIndex;

  players[loserIndex].diceCount -= 1;
  const alive = alivePlayerIndices();
  game.result = {
    bid,
    challengerIndex,
    actualCount,
    wasTrue,
    loserIndex,
    matchCounts: players.map(player => player.diceCount > 0 ? player.dice.filter(value => value === bid.face || value === 1).length : 0),
    winnerIndex: alive.length === 1 ? alive[0] : null
  };
  renderResult();
}

function continueAfterResult() {
  if (game.result.winnerIndex !== null) {
    showView(setupView);
    return;
  }

  const loserIndex = game.result.loserIndex;
  const starter = players[loserIndex].diceCount > 0 ? loserIndex : nextAlivePlayerIndex(loserIndex);
  startRound(starter);
}

document.querySelectorAll('.count-option').forEach(button => {
  button.addEventListener('click', () => {
    const previousNames = [...nameFields.querySelectorAll('input')].map(input => input.value);
    playerCount = Number(button.dataset.count);
    document.querySelectorAll('.count-option').forEach(option => {
      const selected = option === button;
      option.classList.toggle('is-selected', selected);
      option.setAttribute('aria-pressed', String(selected));
    });
    renderNameFields(previousNames);
  });
});

document.querySelector('#openRulesButton').addEventListener('click', () => showView(rulesView));
document.querySelector('#backToSetupButton').addEventListener('click', () => showView(setupView));

document.querySelector('#startGameButton').addEventListener('click', () => {
  document.querySelector('#setupError').hidden = true;
  const names = [...nameFields.querySelectorAll('input')].map(input => input.value.trim());
  if (names.some(name => name.length > 16)) {
    document.querySelector('#setupError').textContent = '名前は16文字以内で入力してください。';
    document.querySelector('#setupError').hidden = false;
    return;
  }
  players = names.map((name, index) => ({
    name: name || `Player ${index + 1}`,
    diceCount: initialDiceCount,
    dice: []
  }));
  game = { round: 0, currentPlayerIndex: 0, currentBid: null, history: [], result: null };
  startRound(0);
});

document.querySelector('#readyButton').addEventListener('click', renderGame);
document.querySelector('#quantityDown').addEventListener('click', () => {
  bidQuantity.value = String(Math.max(1, Number(bidQuantity.value) - 1));
  renderBidControls();
});
document.querySelector('#quantityUp').addEventListener('click', () => {
  bidQuantity.value = String(Math.min(totalDiceInPlay(), Number(bidQuantity.value) + 1));
  renderBidControls();
});
bidQuantity.addEventListener('input', renderBidControls);
document.querySelectorAll('.face-option').forEach(button => {
  button.addEventListener('click', () => {
    selectedFace = Number(button.dataset.face);
    renderBidControls();
  });
});
document.querySelector('#raiseButton').addEventListener('click', addBid);
document.querySelector('#challengeButton').addEventListener('click', callBluff);
document.querySelector('#resultContinueButton').addEventListener('click', continueAfterResult);

renderNameFields();