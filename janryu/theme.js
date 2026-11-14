"use strict";

const themeToggle = document.getElementById("theme-toggle");
const themes = [
    { value: "green", label: "緑" },
    { value: "blue", label: "青" },
    { value: "black", label: "黒" }
];
let themeIndex = 0;

themeToggle.addEventListener("click", () => {
    themeIndex = (themeIndex + 1) % themes.length;
    const theme = themes[themeIndex];
    document.body.dataset.theme = theme.value;
    themeToggle.setAttribute("aria-label", `雀龍 -janryu-。背景色：${theme.label}。押すと背景色を変更`);
});
