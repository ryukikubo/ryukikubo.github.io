"use strict";

const roundControls = [
    { selector: ".round-wind", values: ["東", "南"], label: "場風", index: 0 },
    { selector: ".round-number", values: ["一", "二", "三", "四"], label: "局番号", index: 0 }
];

function configureRoundSettings(gameLength, playerCount) {
    roundControls[0].values = gameLength === "east" ? ["東"] : ["東", "南"];
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

function updateRound(control) {
    const value = control.values[control.index];
    for (const button of document.querySelectorAll(control.selector)) {
        button.textContent = value;
        const canChange = control.values.length > 1;
        button.disabled = !canChange;
        button.setAttribute("aria-label", canChange
            ? `${control.label}：${value}。押すと次の${control.label}に変更`
            : `${control.label}：${value}。対局設定により固定`);
    }
}

function resetRound() {
    for (const control of roundControls) {
        control.index = 0;
        updateRound(control);
    }
}

for (const control of roundControls) {
    const buttons = document.querySelectorAll(control.selector);
    for (const button of buttons) {
        button.addEventListener("click", () => {
            control.index = (control.index + 1) % control.values.length;
            updateRound(control);
            resetIndicator();
        });
    }
}
