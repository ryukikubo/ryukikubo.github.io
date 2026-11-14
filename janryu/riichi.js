"use strict";

const riichiButtons = document.querySelectorAll(".inner-button");
const riichiError = document.getElementById("riichi-error");

function resetRiichi() {
    for (const button of riichiButtons) {
        button.setAttribute("aria-pressed", "false");
    }
    riichiError.textContent = "";
}

for (const button of riichiButtons) {
    button.addEventListener("click", () => {
        const isRiichi = button.getAttribute("aria-pressed") === "true";
        if (!adjustRiichiScore(button.dataset.player, isRiichi)) {
            riichiError.textContent = "点数または供託の本数が計算可能な範囲を超えるため、リーチ状態を変更できません。";
            return;
        }
        riichiError.textContent = "";
        button.setAttribute("aria-pressed", String(!isRiichi));
    });
}
