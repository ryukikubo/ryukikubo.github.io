"use strict";

const setupForm = document.getElementById("setup-form");
const setupDialog = document.getElementById("setup-dialog");
const openSetupButton = document.getElementById("open-setup");
const cancelSetupButton = document.getElementById("cancel-setup");
const capacityInputs = Array.from(setupForm.elements.capacity);
const setupError = document.getElementById("setup-error");
const cupsElement = document.getElementById("cups");
const instruction = document.getElementById("instruction");
const undoButton = document.getElementById("undo");
const resetButton = document.getElementById("reset");

let capacities = [];
let amounts = [];
let selected = null;
let history = [];

function render(message, focusIndex = null) {
    capacities.forEach((capacity, index) => {
        let button = cupsElement.children[index];
        if (!button) {
            button = document.createElement("button");
            button.type = "button";
            button.className = "cup-button";
            const vessel = document.createElement("span");
            vessel.className = "vessel";
            vessel.setAttribute("aria-hidden", "true");
            const water = document.createElement("span");
            water.className = "water";
            vessel.append(water);
            const name = document.createElement("span");
            name.className = "cup-name";
            name.textContent = `CUP 0${index + 1}`;
            const amount = document.createElement("span");
            amount.className = "amount";
            button.append(vessel, name, amount);
            button.addEventListener("click", () => selectCup(index));
            cupsElement.append(button);
        }
        button.setAttribute("aria-pressed", String(selected === index));
        button.setAttribute("aria-label", `カップ${index + 1}、容量 ${capacity}、水量 ${amounts[index]}`);

        const vessel = button.querySelector(".vessel");
        vessel.style.setProperty("--capacity-ratio", capacity / capacities[0]);
        const water = vessel.querySelector(".water");
        water.style.height = `${100 * (amounts[index] / capacity)}%`;
        button.querySelector(".amount").textContent = `${amounts[index]} / ${capacity}`;
    });
    instruction.textContent = message;
    undoButton.disabled = history.length === 0;
    if (focusIndex !== null) {
        cupsElement.children[focusIndex].focus();
    }
}

function selectCup(index) {
    if (selected === null) {
        if (amounts[index] === 0) {
            render("空のカップからは注げません。水の入ったカップを選んでください。", index);
            return;
        }
        selected = index;
        render(`カップ${index + 1}を選択中。注ぎ先を選んでください。`, index);
        return;
    }

    if (selected === index) {
        selected = null;
        render("移し元のカップを選んでください。", index);
        return;
    }
    if (amounts[index] === capacities[index]) {
        render("そのカップは満杯です。別の注ぎ先を選んでください。", index);
        return;
    }

    const source = selected;
    const transferred = Math.min(amounts[source], capacities[index] - amounts[index]);
    history.push([...amounts]);
    amounts[source] -= transferred;
    amounts[index] += transferred;
    selected = null;
    render(`カップ${source + 1}からカップ${index + 1}へ ${transferred} 移しました。`, index);
}

function start(capacityValues) {
    capacities = [...capacityValues].sort((a, b) => b - a);
    amounts = [capacities[0], 0, 0];
    selected = null;
    history = [];
    render("移し元のカップを選んでください。");
}

openSetupButton.addEventListener("click", () => {
    capacityInputs.forEach((input, index) => {
        input.value = capacities[index];
    });
    setupError.textContent = "";
    setupDialog.showModal();
});

cancelSetupButton.addEventListener("click", () => setupDialog.close());

setupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = capacityInputs.map((input) => input.valueAsNumber);
    if (values.some((value) => !Number.isSafeInteger(value) || value <= 0)) {
        setupError.textContent = "容量には1以上の整数を入力してください。";
        return;
    }
    setupError.textContent = "";
    start(values);
    setupDialog.close();
});

undoButton.addEventListener("click", () => {
    if (history.length === 0) {
        return;
    }
    amounts = history.pop();
    selected = null;
    render("ひとつ前の状態に戻しました。");
});

resetButton.addEventListener("click", () => start(capacities));

start(capacityInputs.map((input) => input.valueAsNumber));
