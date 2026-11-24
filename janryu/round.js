"use strict";

const roundControls = [
    { selector: ".round-wind", values: ["東", "南"], label: "場風", index: 0 },
    { selector: ".round-number", values: ["一", "二", "三", "四"], label: "局番号", index: 0 }
];
let southVoicePending = false;

function configureRoundSettings(playerCount) {
    roundControls[1].values = playerCount === 3
        ? ["一", "二", "三"]
        : ["一", "二", "三", "四"];
    for (const control of roundControls) {
        control.index = Math.min(control.index, control.values.length - 1);
        updateRound(control);
    }
}

function getRoundLabel() {
    return `${roundControls.map((control) => control.values[control.index]).join("")}局`;
}

function isFinalRound() {
    const [wind, number] = roundControls;
    return wind.values[wind.index] === (gameLength === "east" ? "東" : "南") &&
        number.index === number.values.length - 1;
}

function selectRoundDealer(button) {
    const activePlayers = getPlayersInTurnOrder();
    const dealerIndex = activePlayers.findIndex((player) => player.rollButton === button);
    const startingIndex = activePlayers.findIndex((player) => player.direction === startingDealer);
    const control = roundControls[1];
    control.index = (dealerIndex - startingIndex + activePlayers.length) % activePlayers.length;
    updateRound(control);
}

function updateRound(control) {
    const value = control.values[control.index];
    for (const element of document.querySelectorAll(control.selector)) {
        element.textContent = value;
        if (control.selector === ".round-wind") {
            element.dataset.wind = value;
        }
        if (element instanceof HTMLButtonElement) {
            const canChange = control.values.length > 1;
            element.disabled = !canChange;
            element.setAttribute("aria-label", canChange
                ? `${control.label}：${value}。押すと次の${control.label}に変更`
                : `${control.label}：${value}。対局設定により固定`);
        }
    }
    if (control.selector === ".round-number") {
        updatePlayerWinds(control.index);
    }
}

function resetRound() {
    southVoicePending = false;
    for (const control of roundControls) {
        control.index = 0;
        updateRound(control);
    }
}

updatePlayerWinds(0);

for (const control of roundControls) {
    const buttons = document.querySelectorAll(`button${control.selector}`);
    for (const button of buttons) {
        button.addEventListener("click", () => {
            control.index = (control.index + 1) % control.values.length;
            if (control.selector === ".round-wind") {
                southVoicePending = control.values[control.index] === "南";
            }
            updateRound(control);
            resetIndicator();
        });
    }
}
