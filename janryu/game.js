"use strict";

const playerSettingsButton = document.getElementById("open-player-settings");
const playerSettingsDialog = document.getElementById("player-settings-dialog");
const playerSettingsForm = document.getElementById("player-settings-form");
const playerCountInput = document.getElementById("player-count");
const playerNameInputs = Array.from(document.querySelectorAll(".player-name-inputs input"));
const playerSettingsError = document.getElementById("player-settings-error");
const cancelPlayerSettings = document.getElementById("cancel-player-settings");
const gameSettingsButton = document.getElementById("open-game-settings");
const gameSettingsDialog = document.getElementById("game-settings-dialog");
const gameSettingsForm = document.getElementById("game-settings-form");
const startPointsInput = document.getElementById("start-points");
const gameSettingsError = document.getElementById("game-settings-error");
const cancelGameSettings = document.getElementById("cancel-game-settings");
const gameLengthDisplay = document.getElementById("game-length-display");
const seatLabels = { north: "北", east: "東", south: "南", west: "西" };
const settlementButton = document.getElementById("open-settlement");
const drawSettlementButton = document.getElementById("open-draw-settlement");
const settlementDialog = document.getElementById("settlement-dialog");
const settlementTitle = document.getElementById("settlement-title");
const settlementRound = document.getElementById("settlement-round");
const settlementDeposit = document.getElementById("settlement-deposit");
const settlementDepositCount = document.getElementById("settlement-deposit-count");
const settlementForm = document.getElementById("settlement-form");
const cancelSettlement = document.getElementById("cancel-settlement");
const confirmSettlement = document.getElementById("confirm-settlement");
const settlementBalance = document.getElementById("settlement-balance");
const depositCountDisplay = document.getElementById("deposit-count");
const depositDisplay = depositCountDisplay.parentElement.parentElement;
let depositCount = 0;
let startingPoints = 0;
let startingDealer = "east";
let gameLength = "half";
let setupPlayerCount = 4;
let setupNames = playerNameInputs.map((input) => input.value);
const seatDirections = ["north", "east", "south", "west"];
let seatAssignments = Object.fromEntries(seatDirections.map((direction) => [direction, null]));
let draftSeatAssignments = Object.assign({}, seatAssignments);
let draftDealerIndex = null;
let selectedPlayerIndex = null;
let activeSeatDrag = null;
let suppressNextClick = false;
let settlementType = "win";
let scoreHold = null;
let comparisonPlayer = null;
const playerTokenList = document.getElementById("player-token-list");
const seatSelectionStatus = document.getElementById("seat-selection-status");
const players = seatDirections.map((direction) => {
    const scoreRegion = document.querySelector(`.player-score-${direction}`);
    const adjustment = document.getElementById(`adjust-${direction}`);
    const settlementEntry = adjustment.closest(".settlement-entry");
    return {
        direction,
        scoreRegion,
        scoreLabel: scoreRegion.getAttribute("aria-label"),
        seatTarget: document.getElementById(`seat-target-${direction}`),
        seatName: document.getElementById(`seat-name-${direction}`),
        nameDisplay: scoreRegion.querySelector(".player-name"),
        windDisplay: scoreRegion.querySelector(".player-wind"),
        settlementName: document.getElementById(`settlement-name-${direction}`),
        settlementEntry,
        rollButton: document.querySelector(`.outer-button.${direction}`),
        riichiButton: document.querySelector(`.inner-button[data-player="${direction}"]`),
        adjustment,
        adjustmentReset: settlementEntry.querySelector(".adjustment-reset"),
        directionButtons: settlementEntry.querySelectorAll(".settlement-direction button"),
        scoreStickButtons: settlementEntry.querySelectorAll(".score-stick"),
        riichiIndicator: document.getElementById(`settlement-riichi-${direction}`),
        display: document.getElementById(`score-${direction}`),
        active: true,
        score: 0
    };
});

function normalizeSeatAssignments(assignments) {
    const normalized = Object.fromEntries(seatDirections.map((direction) => [direction, null]));
    const assigned = new Set();
    for (const player of players) {
        const playerIndex = assignments[player.direction];
        if (Number.isInteger(playerIndex) && playerIndex >= 0 &&
            playerIndex < setupPlayerCount && !assigned.has(playerIndex)) {
            normalized[player.direction] = playerIndex;
            assigned.add(playerIndex);
        }
    }
    return normalized;
}

function getPlayerSeat(playerIndex) {
    return seatDirections.find((direction) => draftSeatAssignments[direction] === playerIndex) || null;
}

function updateDealerOptions() {
    const occupiedPlayers = players.filter((player) =>
        Number.isInteger(draftSeatAssignments[player.direction])
    );
    const preferredDealer = occupiedPlayers.find((player) =>
        draftSeatAssignments[player.direction] === draftDealerIndex
    ) || occupiedPlayers.find((player) => player.direction === startingDealer) || occupiedPlayers[0];
    draftDealerIndex = preferredDealer ? draftSeatAssignments[preferredDealer.direction] : null;

    for (const player of players) {
        const playerIndex = draftSeatAssignments[player.direction];
        const isOccupied = Number.isInteger(playerIndex);
        const isDealer = isOccupied && playerIndex === draftDealerIndex;
        player.seatTarget.classList.toggle("is-vacant", !isOccupied);
        player.seatTarget.classList.toggle("is-starting-dealer", isDealer);
        player.seatTarget.setAttribute("aria-pressed", String(isDealer));
        if (isOccupied) {
            const name = setupNames[playerIndex];
            player.seatTarget.setAttribute("aria-label", `${seatLabels[player.direction]}側の席、${name}${isDealer ? "、起家として選択中" : "。押すと起家に設定"}`);
        } else {
            player.seatTarget.setAttribute("aria-label", `${seatLabels[player.direction]}側の席、空席`);
        }
    }
}

function renderSeatAssignments() {
    if (selectedPlayerIndex !== null && selectedPlayerIndex >= setupPlayerCount) {
        selectedPlayerIndex = null;
    }
    playerTokenList.replaceChildren();
    setupNames.slice(0, setupPlayerCount).forEach((name, index) => {
        const token = document.createElement("button");
        token.type = "button";
        token.className = "player-token";
        token.setAttribute("aria-pressed", String(selectedPlayerIndex === index));
        const playerSeat = getPlayerSeat(index);
        const status = playerSeat ? `${seatLabels[playerSeat]}側` : "未配置";
        token.setAttribute("aria-label", `${name}、${status}。クリックして選択`);
        const nameDisplay = document.createElement("span");
        nameDisplay.className = "player-token-name";
        nameDisplay.textContent = name;
        const statusDisplay = document.createElement("span");
        statusDisplay.className = "player-token-status";
        statusDisplay.textContent = status;
        token.append(nameDisplay, statusDisplay);
        token.addEventListener("click", () => {
            if (suppressNextClick) {
                suppressNextClick = false;
                return;
            }
            selectedPlayerIndex = selectedPlayerIndex === index ? null : index;
            seatSelectionStatus.textContent = "";
            renderSeatAssignments();
        });
        token.addEventListener("pointerdown", (event) => beginSeatDrag(event, index, token));
        token.addEventListener("pointermove", updateSeatDrag);
        token.addEventListener("pointerup", (event) => endSeatDrag(event, false));
        token.addEventListener("pointercancel", (event) => endSeatDrag(event, true));
        playerTokenList.append(token);
    });

    for (const player of players) {
        const playerIndex = draftSeatAssignments[player.direction];
        const isOccupied = Number.isInteger(playerIndex);
        player.seatName.textContent = isOccupied ? setupNames[playerIndex] : "空席";
    }
    updateDealerOptions();
}

function assignPlayerToSeat(playerIndex, direction) {
    const sourceDirection = getPlayerSeat(playerIndex);
    const displacedPlayerIndex = draftSeatAssignments[direction];
    if (!sourceDirection && Number.isInteger(displacedPlayerIndex) && displacedPlayerIndex !== playerIndex) {
        seatSelectionStatus.textContent = "その席は埋まっています。空席を選ぶか、配置済みのプレイヤーを移動してください。";
        return;
    }
    if (sourceDirection !== direction) {
        if (sourceDirection) {
            draftSeatAssignments[sourceDirection] = displacedPlayerIndex;
        }
        draftSeatAssignments[direction] = playerIndex;
    }
    selectedPlayerIndex = null;
    renderSeatAssignments();
    seatSelectionStatus.textContent = "";
}

function unassignPlayer(playerIndex) {
    const direction = getPlayerSeat(playerIndex);
    if (direction) {
        draftSeatAssignments[direction] = null;
    }
    selectedPlayerIndex = null;
    renderSeatAssignments();
    seatSelectionStatus.textContent = "";
}

function beginSeatDrag(event, playerIndex, token) {
    if (!event.isPrimary || event.button !== 0) {
        return;
    }
    activeSeatDrag = {
        pointerId: event.pointerId,
        playerIndex,
        token,
        startX: event.clientX,
        startY: event.clientY,
        dragging: false,
        preview: null,
        highlightedTarget: null
    };
    token.setPointerCapture(event.pointerId);
}

function updateSeatDrag(event) {
    const drag = activeSeatDrag;
    if (!drag || drag.pointerId !== event.pointerId) {
        return;
    }
    if (!drag.dragging && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 6) {
        return;
    }
    event.preventDefault();
    if (!drag.dragging) {
        drag.dragging = true;
        drag.token.classList.add("is-dragging");
        document.body.classList.add("seat-dragging");
        drag.preview = drag.token.cloneNode(true);
        drag.preview.classList.remove("is-dragging");
        drag.preview.classList.add("seat-drag-preview");
        drag.preview.setAttribute("aria-hidden", "true");
        gameSettingsDialog.append(drag.preview);
    }
    drag.preview.style.left = `${event.clientX}px`;
    drag.preview.style.top = `${event.clientY}px`;
    const hoveredElement = document.elementFromPoint(event.clientX, event.clientY);
    const target = hoveredElement && hoveredElement.closest(".seat-drop-target");
    if (drag.highlightedTarget !== target) {
        if (drag.highlightedTarget) {
            drag.highlightedTarget.classList.remove("is-drop-target");
        }
        drag.highlightedTarget = target;
        if (target) {
            target.classList.add("is-drop-target");
        }
    }
}

function endSeatDrag(event, cancelled) {
    const drag = activeSeatDrag;
    if (!drag || drag.pointerId !== event.pointerId) {
        return;
    }
    if (drag.dragging) {
        suppressNextClick = true;
        const target = document.elementFromPoint(event.clientX, event.clientY);
        const seatTarget = target && target.closest(".seat-drop-target");
        const playerBank = target && target.closest("#player-token-list");
        if (!cancelled && seatTarget) {
            const position = seatTarget.closest(".seat-position");
            assignPlayerToSeat(drag.playerIndex, position.dataset.seat);
        } else if (!cancelled && playerBank) {
            unassignPlayer(drag.playerIndex);
        }
        setTimeout(() => {
            suppressNextClick = false;
        }, 0);
    }
    if (drag.highlightedTarget) {
        drag.highlightedTarget.classList.remove("is-drop-target");
    }
    drag.token.classList.remove("is-dragging");
    if (drag.preview) {
        drag.preview.remove();
    }
    document.body.classList.remove("seat-dragging");
    activeSeatDrag = null;
}

for (const player of players) {
    player.seatTarget.addEventListener("click", () => {
        if (suppressNextClick) {
            suppressNextClick = false;
            return;
        }
        if (selectedPlayerIndex === null) {
            const playerIndex = draftSeatAssignments[player.direction];
            if (Number.isInteger(playerIndex)) {
                draftDealerIndex = playerIndex;
                updateDealerOptions();
                seatSelectionStatus.textContent = "";
                return;
            }
            seatSelectionStatus.textContent = "先にプレイヤー名を選択してください。";
            return;
        }
        assignPlayerToSeat(selectedPlayerIndex, player.direction);
    });
}

function updateDeposit(count) {
    depositCount = count;
    depositCountDisplay.textContent = count.toLocaleString("ja-JP");
    depositDisplay.setAttribute("aria-label", `供託 ${count}本`);
}

function updateScores(scores) {
    players.forEach((player, index) => {
        player.score = scores[index];
    });
    renderScores();
}

function getPlayersInTurnOrder() {
    return [...players].reverse().filter((player) => player.active);
}

function updatePlayerWinds(roundIndex) {
    const activePlayers = getPlayersInTurnOrder();
    const startingIndex = activePlayers.findIndex((player) => player.direction === startingDealer);
    const dealerIndex = (startingIndex + roundIndex) % activePlayers.length;
    const winds = ["東", "南", "西", "北"];
    activePlayers.forEach((player, index) => {
        player.windDisplay.textContent = winds[(index - dealerIndex + activePlayers.length) % activePlayers.length];
    });
    renderScores();
}

function renderScores() {
    for (const player of players) {
        let text = player.score.toLocaleString("ja-JP");
        if (comparisonPlayer && player !== comparisonPlayer) {
            const difference = BigInt(player.score) - BigInt(comparisonPlayer.score);
            text = `${difference > 0n ? "+" : ""}${difference.toLocaleString("ja-JP")}`;
        }
        player.display.textContent = text;
        player.display.parentElement.style.fontSize = `min(4.2cqw, ${30 / (text.length + 2)}cqw, 29px)`;
        const dealer = player.scoreRegion.classList.contains("starting-dealer") ? "、起家" : "";
        const scoreType = comparisonPlayer && player !== comparisonPlayer ? "点差" : "点数";
        player.scoreRegion.setAttribute("aria-label", `${player.scoreLabel}、${player.nameDisplay.textContent}、自風 ${player.windDisplay.textContent}${dealer}、${scoreType} ${text}点`);
    }
}

function endScoreHold() {
    if (!scoreHold) {
        return;
    }
    clearTimeout(scoreHold.timer);
    scoreHold = null;
    if (comparisonPlayer) {
        comparisonPlayer = null;
        renderScores();
    }
}

function beginScoreHold(player, input, pointerId = null) {
    if (scoreHold) {
        return false;
    }
    scoreHold = {
        player,
        input,
        pointerId,
        timer: setTimeout(() => {
            comparisonPlayer = player;
            renderScores();
        }, 500)
    };
    return true;
}

for (const player of players) {
    const region = player.scoreRegion;
    region.addEventListener("pointerdown", (event) => {
        if (!event.isPrimary || event.button !== 0) {
            return;
        }
        if (beginScoreHold(player, "pointer", event.pointerId)) {
            region.setPointerCapture(event.pointerId);
        }
    });
    for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) {
        region.addEventListener(type, (event) => {
            if (scoreHold && scoreHold.input === "pointer" && scoreHold.pointerId === event.pointerId) {
                endScoreHold();
            }
        });
    }
    region.addEventListener("contextmenu", (event) => event.preventDefault());
    region.addEventListener("keydown", (event) => {
        if (event.key === " ") {
            event.preventDefault();
            if (!event.repeat) {
                beginScoreHold(player, "keyboard");
            }
        }
    });
    region.addEventListener("keyup", (event) => {
        if (event.key === " " && scoreHold && scoreHold.input === "keyboard" && scoreHold.player === player) {
            event.preventDefault();
            endScoreHold();
        }
    });
    region.addEventListener("blur", () => {
        if (scoreHold && scoreHold.input === "keyboard" && scoreHold.player === player) {
            endScoreHold();
        }
    });
}

window.addEventListener("blur", endScoreHold);
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        endScoreHold();
    }
});
renderScores();

function adjustRiichiScore(direction, isRiichi) {
    const player = players.find((item) => item.direction === direction && item.active);
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

function updatePlayerNameFields() {
    const count = Number(playerCountInput.value);
    playerNameInputs.forEach((input, index) => {
        const enabled = index < count;
        input.closest("label").hidden = !enabled;
        input.disabled = !enabled;
        input.required = enabled;
    });
}

playerSettingsButton.addEventListener("click", () => {
    playerCountInput.value = String(setupPlayerCount);
    playerNameInputs.forEach((input, index) => {
        input.value = setupNames[index];
    });
    updatePlayerNameFields();
    playerSettingsError.textContent = "";
    playerSettingsDialog.showModal();
});

playerCountInput.addEventListener("change", updatePlayerNameFields);

cancelPlayerSettings.addEventListener("click", () => playerSettingsDialog.close());

playerSettingsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const count = Number(playerCountInput.value);
    const names = playerNameInputs.map((input) => input.value.trim());
    if (names.slice(0, count).some((name) => name.length === 0)) {
        playerSettingsError.textContent = "各プレイヤーの名前を入力してください。";
        return;
    }

    setupPlayerCount = count;
    setupNames = names;
    seatAssignments = normalizeSeatAssignments(seatAssignments);
    draftSeatAssignments = Object.assign({}, seatAssignments);
    selectedPlayerIndex = null;
    playerSettingsDialog.close();
});

gameSettingsButton.addEventListener("click", () => {
    draftSeatAssignments = normalizeSeatAssignments(seatAssignments);
    draftDealerIndex = draftSeatAssignments[startingDealer];
    selectedPlayerIndex = null;
    renderSeatAssignments();
    startPointsInput.value = String(startingPoints);
    gameSettingsForm.querySelector(`input[name="game-length"][value="${gameLength}"]`).checked = true;
    gameSettingsError.textContent = "";
    gameSettingsDialog.showModal();
});

cancelGameSettings.addEventListener("click", () => gameSettingsDialog.close());

gameSettingsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const points = startPointsInput.valueAsNumber;
    if (!Number.isSafeInteger(points)) {
        gameSettingsError.textContent = "開始点数は安全に扱える範囲の整数で入力してください。";
        return;
    }
    const assignedIndices = Object.values(draftSeatAssignments).filter(Number.isInteger);
    if (assignedIndices.length !== setupPlayerCount ||
        new Set(assignedIndices).size !== setupPlayerCount ||
        assignedIndices.some((value) => value >= setupPlayerCount)) {
        gameSettingsError.textContent = "全プレイヤーを重複なく席に配置してください。";
        return;
    }
    const dealer = players.find((player) =>
        Number.isInteger(draftSeatAssignments[player.direction]) &&
        draftSeatAssignments[player.direction] === draftDealerIndex
    );
    if (!dealer) {
        gameSettingsError.textContent = "起家を選択してください。";
        return;
    }

    players.forEach((player) => {
        const playerIndex = draftSeatAssignments[player.direction];
        const isActive = Number.isInteger(playerIndex);
        const name = isActive ? setupNames[playerIndex] : "";
        player.active = isActive;
        player.scoreRegion.hidden = !isActive;
        player.rollButton.hidden = !isActive;
        player.riichiButton.hidden = !isActive;
        player.settlementEntry.hidden = !isActive;
        player.adjustment.disabled = !isActive;
        player.nameDisplay.textContent = name;
        player.nameDisplay.title = name;
        player.settlementName.textContent = name;
        player.settlementName.title = name;
        const isStartingDealer = player === dealer;
        player.scoreRegion.classList.toggle("starting-dealer", isStartingDealer);
    });
    startingPoints = points;
    startingDealer = dealer.direction;
    gameLength = gameSettingsForm.querySelector('input[name="game-length"]:checked').value;
    gameLengthDisplay.textContent = `${setupPlayerCount}人打・${gameLength === "east" ? "東風戦" : "半荘戦"}`;
    seatAssignments = Object.assign({}, draftSeatAssignments);
    updateScores(players.map(() => points));
    resetDice();
    resetRiichi();
    configureRoundSettings(setupPlayerCount);
    resetRound();
    resetIndicator();
    updateDeposit(0);
    gameSettingsDialog.close();
});

function getSettlementSummary() {
    const activePlayers = players.filter((player) => player.active);
    const amounts = activePlayers.map((player) => player.adjustment.valueAsNumber);
    if (amounts.some((amount) => !Number.isSafeInteger(amount) || amount < 0)) {
        return null;
    }
    const adjustments = activePlayers.map((player, index) =>
        player.directionButtons[1].getAttribute("aria-pressed") === "true" ? -amounts[index] : amounts[index]
    );
    const scores = players.map((player) => {
        const index = activePlayers.indexOf(player);
        return index === -1 ? player.score : player.score + adjustments[index];
    });
    if (scores.some((score) => !Number.isSafeInteger(score))) {
        return null;
    }
    const total = adjustments.reduce((sum, value) => sum + BigInt(value), 0n);
    const requiredTotal = settlementType === "win" ? BigInt(depositCount) * 1000n : 0n;
    return { scores, difference: requiredTotal - total };
}

function updateSettlementBalance() {
    const summary = getSettlementSummary();
    const balanced = summary !== null && summary.difference === 0n;
    settlementBalance.dataset.balanced = String(balanced);
    confirmSettlement.disabled = !balanced;
    if (!summary) {
        settlementBalance.textContent = "-";
        settlementBalance.setAttribute("aria-label", "入力点数と精算後の点数が計算可能な範囲であることを確認してください。");
        return;
    }
    const difference = summary.difference;
    settlementBalance.textContent = difference === 0n
        ? "OK"
        : `${difference > 0n ? "+" : ""}${difference.toLocaleString("ja-JP")}点`;
    settlementBalance.setAttribute("aria-label", difference === 0n
        ? "精算誤差なし"
        : `${difference > 0n ? "受取" : "支払"}が${(difference > 0n ? difference : -difference).toLocaleString("ja-JP")}点不足しています。`);
}

function openSettlement(type) {
    settlementType = type;
    for (const player of players) {
        if (!player.active) {
            continue;
        }
        player.adjustment.value = "0";
        setSettlementDirection(player, false);
        player.riichiIndicator.hidden = player.riichiButton.getAttribute("aria-pressed") !== "true";
    }
    settlementTitle.textContent = `${type === "draw" ? "流局" : "和了"}・点棒精算`;
    settlementRound.textContent = `${getRoundLabel()} ${honbaCount}本場`;
    settlementDepositCount.textContent = depositCount.toLocaleString("ja-JP");
    settlementDeposit.setAttribute("aria-label", `供託 ${depositCount}本`);
    updateSettlementBalance();
    settlementDialog.showModal();
}

function setSettlementDirection(player, isPayment) {
    player.directionButtons[0].setAttribute("aria-pressed", String(!isPayment));
    player.directionButtons[1].setAttribute("aria-pressed", String(isPayment));
}

for (const player of players) {
    for (const [index, button] of player.directionButtons.entries()) {
        button.addEventListener("click", () => {
            setSettlementDirection(player, index === 1);
            updateSettlementBalance();
        });
    }
    player.adjustment.addEventListener("input", updateSettlementBalance);
    player.adjustmentReset.addEventListener("click", () => {
        player.adjustment.value = "0";
        updateSettlementBalance();
    });
    for (const button of player.scoreStickButtons) {
        button.addEventListener("click", () => {
            const amount = player.adjustment.valueAsNumber;
            const total = amount + Number(button.dataset.points);
            if (!Number.isSafeInteger(amount) || amount < 0 || !Number.isSafeInteger(total)) {
                console.error("点数は安全に扱える範囲の0以上の整数で入力してください。");
                return;
            }
            player.adjustment.value = String(total);
            updateSettlementBalance();
        });
    }
}

settlementButton.addEventListener("click", () => openSettlement("win"));
drawSettlementButton.addEventListener("click", () => openSettlement("draw"));

cancelSettlement.addEventListener("click", () => settlementDialog.close());

settlementForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const summary = getSettlementSummary();
    if (!summary || summary.difference !== 0n) {
        updateSettlementBalance();
        console.error("精算を確定できません。入力点数と収支を確認してください。");
        return;
    }
    updateScores(summary.scores);
    if (settlementType === "win") {
        updateDeposit(0);
    }
    resetRiichi();
    settlementDialog.close();
});
