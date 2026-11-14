"use strict";

const startButton = document.getElementById("start-game");
const startDialog = document.getElementById("start-dialog");
const startForm = document.getElementById("start-form");
const startPointsInput = document.getElementById("start-points");
const cancelStart = document.getElementById("cancel-start");
const scoreError = document.getElementById("score-error");
const settlementButton = document.getElementById("open-settlement");
const drawSettlementButton = document.getElementById("open-draw-settlement");
const settlementDialog = document.getElementById("settlement-dialog");
const settlementTitle = document.getElementById("settlement-title");
const settlementRound = document.getElementById("settlement-round");
const settlementDeposit = document.getElementById("settlement-deposit");
const settlementDepositCount = document.getElementById("settlement-deposit-count");
const settlementDescription = document.getElementById("settlement-description");
const settlementForm = document.getElementById("settlement-form");
const cancelSettlement = document.getElementById("cancel-settlement");
const settlementError = document.getElementById("settlement-error");
const depositCountDisplay = document.getElementById("deposit-count");
const depositDisplay = depositCountDisplay.parentElement.parentElement;
let depositCount = 0;
let startingPoints = 0;
let startingDealer = null;
let settlementType = "win";
const players = ["north", "east", "south", "west"].map((direction) => {
    const scoreRegion = document.querySelector(`.player-score-${direction}`);
    const adjustment = document.getElementById(`adjust-${direction}`);
    return {
        direction,
        scoreRegion,
        scoreLabel: scoreRegion.getAttribute("aria-label"),
        dealerInput: startForm.querySelector(`input[name="starting-dealer"][value="${direction}"]`),
        nameInput: document.getElementById(`name-${direction}`),
        nameDisplay: scoreRegion.querySelector(".player-name"),
        settlementName: document.getElementById(`settlement-name-${direction}`),
        adjustment,
        directionButtons: adjustment.parentElement.querySelectorAll(".settlement-direction button"),
        riichiButton: document.querySelector(`.inner-button[data-player="${direction}"]`),
        riichiIndicator: document.getElementById(`settlement-riichi-${direction}`),
        display: document.getElementById(`score-${direction}`),
        score: 0
    };
});

function updateDeposit(count) {
    depositCount = count;
    depositCountDisplay.textContent = count.toLocaleString("ja-JP");
    depositDisplay.setAttribute("aria-label", `供託 ${count}本`);
}

function updateScores(scores) {
    players.forEach((player, index) => {
        player.score = scores[index];
        const text = player.score.toLocaleString("ja-JP");
        player.display.textContent = text;
        player.display.parentElement.style.fontSize = `min(4.2cqw, ${30 / (text.length + 2)}cqw, 29px)`;
    });
}

function adjustRiichiScore(direction, isRiichi) {
    const player = players.find((item) => item.direction === direction);
    if (!player) {
        throw new Error(`Unknown riichi player: ${direction}`);
    }
    const score = player.score + (isRiichi ? 1000 : -1000);
    const nextDepositCount = depositCount + (isRiichi ? -1 : 1);
    if (!Number.isSafeInteger(score) || !Number.isSafeInteger(nextDepositCount) || nextDepositCount < 0) {
        return false;
    }
    updateScores(players.map((item) => item === player ? score : item.score));
    updateDeposit(nextDepositCount);
    return true;
}

startButton.addEventListener("click", () => {
    startPointsInput.value = String(startingPoints);
    for (const player of players) {
        player.nameInput.value = player.nameDisplay.textContent;
        player.dealerInput.checked = player.direction === startingDealer;
    }
    scoreError.textContent = "";
    startDialog.showModal();
});

cancelStart.addEventListener("click", () => startDialog.close());

startForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const points = startPointsInput.valueAsNumber;
    const names = players.map((player) => player.nameInput.value.trim());
    const dealer = players.find((player) => player.dealerInput.checked);
    if (names.some((name) => name.length === 0)) {
        scoreError.textContent = "各プレイヤーの名前を入力してください。";
        return;
    }
    if (!Number.isSafeInteger(points)) {
        scoreError.textContent = "点数は安全に扱える範囲の整数で入力してください。";
        return;
    }
    if (!dealer) {
        scoreError.textContent = "起家を選択してください。";
        return;
    }

    players.forEach((player, index) => {
        player.nameDisplay.textContent = names[index];
        player.nameDisplay.title = names[index];
        player.settlementName.textContent = names[index];
        player.settlementName.title = names[index];
        const isStartingDealer = player === dealer;
        player.scoreRegion.classList.toggle("starting-dealer", isStartingDealer);
        player.scoreRegion.setAttribute("aria-label", `${player.scoreLabel}${isStartingDealer ? "（起家）" : ""}`);
    });
    startingPoints = points;
    startingDealer = dealer.direction;
    updateScores(players.map(() => points));
    resetDice();
    resetRiichi();
    resetRound();
    resetIndicator();
    updateDeposit(0);
    startDialog.close();
});

function openSettlement(type) {
    settlementType = type;
    for (const player of players) {
        player.adjustment.value = "0";
        setSettlementDirection(player, false);
        player.riichiIndicator.hidden = player.riichiButton.getAttribute("aria-pressed") !== "true";
    }
    settlementTitle.textContent = `${type === "draw" ? "流局" : "和了"}・点棒精算`;
    settlementRound.textContent = `${getRoundLabel()} ${honbaCount}本場`;
    settlementDepositCount.textContent = depositCount.toLocaleString("ja-JP");
    settlementDeposit.setAttribute("aria-label", `供託 ${depositCount}本`);
    settlementDescription.textContent = type === "draw"
        ? "各プレイヤーの受取・支払と点数を入力し、増減の合計を0点にしてください。確定すると供託は維持され、リーチ状態が解除されます。"
        : "各プレイヤーの受取・支払と点数を入力し、増減の合計を供託点数と同じにしてください。供託の受け取りは手動で入力します。確定すると供託とリーチ状態が解除されます。";
    settlementError.textContent = "";
    settlementDialog.showModal();
}

function setSettlementDirection(player, isPayment) {
    player.directionButtons[0].setAttribute("aria-pressed", String(!isPayment));
    player.directionButtons[1].setAttribute("aria-pressed", String(isPayment));
}

for (const player of players) {
    player.directionButtons[0].addEventListener("click", () => setSettlementDirection(player, false));
    player.directionButtons[1].addEventListener("click", () => setSettlementDirection(player, true));
}

settlementButton.addEventListener("click", () => openSettlement("win"));
drawSettlementButton.addEventListener("click", () => openSettlement("draw"));

cancelSettlement.addEventListener("click", () => settlementDialog.close());

settlementForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const amounts = players.map((player) => player.adjustment.valueAsNumber);
    if (amounts.some((amount) => !Number.isSafeInteger(amount) || amount < 0)) {
        settlementError.textContent = "点数は安全に扱える範囲の0以上の整数で入力してください。";
        return;
    }
    const adjustments = players.map((player, index) =>
        player.directionButtons[1].getAttribute("aria-pressed") === "true" ? -amounts[index] : amounts[index]
    );
    const scores = players.map((player, index) => player.score + adjustments[index]);
    if (scores.some((score) => !Number.isSafeInteger(score))) {
        settlementError.textContent = "精算後の点数は安全に扱える範囲の整数で入力してください。";
        return;
    }
    const total = adjustments.reduce((sum, value) => sum + BigInt(value), 0n);
    const requiredTotal = settlementType === "win" ? BigInt(depositCount) * 1000n : 0n;
    if (total !== requiredTotal) {
        settlementError.textContent = settlementType === "win"
            ? "入力した増減点の合計を供託点数と同じにしてください。"
            : "入力した増減点の合計を0点にしてください。";
        return;
    }
    updateScores(scores);
    if (settlementType === "win") {
        updateDeposit(0);
    }
    resetRiichi();
    settlementDialog.close();
});
