"use strict";

const roundControls = [
    { selector: ".round-wind", values: ["東", "南", "西", "北"], label: "場風", index: 0 },
    { selector: ".round-number", values: ["一", "二", "三", "四"], label: "局番号", index: 0 }
];

function getRoundLabel() {
    return `${roundControls.map((control) => control.values[control.index]).join("")}局`;
}

function updateRound(control) {
    const value = control.values[control.index];
    for (const button of document.querySelectorAll(control.selector)) {
        button.textContent = value;
        button.setAttribute("aria-label", `${control.label}：${value}。押すと次の${control.label}に変更`);
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
