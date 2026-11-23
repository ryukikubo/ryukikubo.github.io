"use strict";

const riichiButtons = document.querySelectorAll(".inner-button");
const riichiError = document.getElementById("riichi-error");
const reachSounds = [
    new Audio("./sounds/reach_01.mp3"),
    new Audio("./sounds/reach_02.mp3")
];

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
        if (!isRiichi) {
            const sound = reachSounds[Math.floor(Math.random() * reachSounds.length)];
            sound.currentTime = 0;
            sound.play().catch((error) => console.error("リーチ音声を再生できませんでした。", error));
        }
    });
}
