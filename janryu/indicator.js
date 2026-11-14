"use strict";

const indicatorGroups = document.querySelectorAll(".indicator-bars");
const indicatorStatus = document.getElementById("indicator-status");
const indicatorButtons = document.querySelectorAll(".indicator-button");
let honbaCount = 0;

function updateIndicator() {
    const purple = honbaCount >= 5;
    const blueCount = purple ? honbaCount - 5 : honbaCount;

    for (const group of indicatorGroups) {
        const bars = group.querySelectorAll("span");
        bars.forEach((bar, index) => {
            const fromBottom = index;
            const state = purple && fromBottom === 0 ? "purple" :
                fromBottom < blueCount + (purple ? 1 : 0) ? "blue" : "off";
            bar.dataset.state = state;
        });
    }

    indicatorStatus.textContent = `${honbaCount}本場`;
}

function resetIndicator() {
    honbaCount = 0;
    for (const button of indicatorButtons) {
        button.classList.remove("press-animation");
    }
    updateIndicator();
}

for (const button of indicatorButtons) {
    button.addEventListener("click", () => {
        button.classList.remove("press-animation");
        void button.offsetWidth;
        button.classList.add("press-animation");
        honbaCount = (honbaCount + 1) % 9;
        updateIndicator();
    });
}

updateIndicator();
