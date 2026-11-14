"use strict";

const pipPositions = [
    [[2, 2]],
    [[1, 1], [3, 3]],
    [[1, 1], [2, 2], [3, 3]],
    [[1, 1], [1, 3], [3, 1], [3, 3]],
    [[1, 1], [1, 3], [2, 2], [3, 1], [3, 3]],
    [[1, 1], [1, 3], [2, 1], [2, 3], [3, 1], [3, 3]]
];

const rollButtons = document.querySelectorAll(".outer-button");
const dice = document.querySelectorAll(".die");
const result = document.getElementById("dice-result");
const table = document.querySelector(".table");

function showDie(die, value) {
    const pips = pipPositions[value - 1].map(([row, column]) => {
        const pip = document.createElement("span");
        pip.style.gridArea = `${row} / ${column}`;
        return pip;
    });

    die.replaceChildren(...pips);
    die.dataset.value = value;
    die.setAttribute("aria-label", `サイコロ、${value}の目`);
}

function resetDice() {
    for (const button of rollButtons) {
        button.setAttribute("aria-pressed", "false");
        button.classList.remove("press-animation");
    }
    for (const die of dice) {
        die.classList.remove("roll-animation");
        showDie(die, 1);
    }
    result.textContent = "";
}

for (const button of rollButtons) {
    button.addEventListener("click", () => {
        const previousButton = Array.from(rollButtons).find((rollButton) =>
            rollButton.getAttribute("aria-pressed") === "true"
        );
        if (previousButton && previousButton !== button) {
            resetIndicator();
        }
        for (const rollButton of rollButtons) {
            rollButton.setAttribute("aria-pressed", String(rollButton === button));
            rollButton.classList.remove("press-animation");
        }
        for (const die of dice) {
            die.classList.remove("roll-animation");
        }

        void table.offsetWidth;
        button.classList.add("press-animation");
        for (const die of dice) {
            die.classList.add("roll-animation");
        }

        const values = Array.from(dice, (die) => {
            const value = Math.floor(Math.random() * 6) + 1;
            showDie(die, value);
            return value;
        });
        result.textContent = `サイコロの出目は${values[0]}と${values[1]}です。`;
    });
}
