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
const diceOrbitDuration = 650;
let rollGeneration = 0;
let rollFrame = null;

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

function cancelDiceRoll() {
    rollGeneration++;
    if (rollFrame !== null) {
        cancelAnimationFrame(rollFrame);
        rollFrame = null;
    }
}

function finishDiceRoll(generation, facesAlreadyRolled = false) {
    if (generation !== rollGeneration) {
        return;
    }
    cancelDiceRoll();
    const values = Array.from(dice, (die) => {
        const value = facesAlreadyRolled ? Number(die.dataset.value) : Math.floor(Math.random() * 6) + 1;
        if (!facesAlreadyRolled) {
            showDie(die, value);
        }
        return value;
    });
    result.textContent = `サイコロの出目は${values[0]}と${values[1]}です。`;
}

function animateDiceFaces(animation, generation) {
    for (const die of dice) {
        showDie(die, Math.floor(Math.random() * 6) + 1);
    }
    let lastStep = 0;
    function updateFaces() {
        if (generation !== rollGeneration) {
            return;
        }
        const time = animation.currentTime || 0;
        if (time >= diceOrbitDuration) {
            rollFrame = null;
            return;
        }
        const step = Math.floor(time / 110);
        if (step !== lastStep) {
            lastStep = step;
            for (const die of dice) {
                const current = Number(die.dataset.value);
                const next = ((current + Math.floor(Math.random() * 5)) % 6) + 1;
                showDie(die, next);
            }
        }
        rollFrame = requestAnimationFrame(updateFaces);
    }
    rollFrame = requestAnimationFrame(updateFaces);
    animation.finished.then(
        () => finishDiceRoll(generation, true),
        () => finishDiceRoll(generation, true)
    );
}

function resetDice() {
    cancelDiceRoll();
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
        cancelDiceRoll();
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

        const generation = rollGeneration;
        const animation = dice[0].getAnimations().find((item) => item.animationName === "dice-roll");
        if (animation) {
            result.textContent = "サイコロを振っています。";
            animateDiceFaces(animation, generation);
        } else {
            finishDiceRoll(generation);
        }
    });
}
