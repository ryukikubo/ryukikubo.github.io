"use strict";

const soundSettingsButton = document.getElementById("open-sound-settings");
const soundSettingsDialog = document.getElementById("sound-settings-dialog");
const soundSettingsForm = document.getElementById("sound-settings-form");
const voiceEnabledInput = document.getElementById("voice-enabled");
const voiceCharacterInput = document.getElementById("voice-character");
const cancelSoundSettings = document.getElementById("cancel-sound-settings");
const progressVoices = {
    zunda: {
        reach: [new Audio("./sounds/zunda/reach01.mp3"), new Audio("./sounds/zunda/reach02.mp3")],
        gameStart: [new Audio("./sounds/zunda/game_start.mp3")],
        intoSouth: [new Audio("./sounds/zunda/into_south.mp3")],
        ohrasu: [new Audio("./sounds/zunda/ohrasu.mp3")]
    },
    metan: {
        reach: [new Audio("./sounds/metan/reach01.mp3"), new Audio("./sounds/metan/reach02.mp3")],
        gameStart: [new Audio("./sounds/metan/game_start.mp3")],
        intoSouth: [new Audio("./sounds/metan/into_south.mp3")],
        ohrasu: [new Audio("./sounds/metan/ohrasu.mp3")]
    }
};
let voiceEnabled = true;
let voiceCharacter = "zunda";

function updateVoiceCharacterInput() {
    voiceCharacterInput.disabled = voiceEnabledInput.value === "off";
}

soundSettingsButton.addEventListener("click", () => {
    voiceEnabledInput.value = voiceEnabled ? "on" : "off";
    voiceCharacterInput.value = voiceCharacter;
    updateVoiceCharacterInput();
    soundSettingsDialog.showModal();
});

voiceEnabledInput.addEventListener("change", updateVoiceCharacterInput);
cancelSoundSettings.addEventListener("click", () => soundSettingsDialog.close());

soundSettingsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    voiceEnabled = voiceEnabledInput.value === "on";
    voiceCharacter = voiceCharacterInput.value;
    for (const sound of Object.values(progressVoices).flatMap((voices) => Object.values(voices).flat())) {
        sound.pause();
    }
    soundSettingsDialog.close();
});

function playProgressVoice(type) {
    if (!voiceEnabled) {
        return;
    }
    const sounds = progressVoices[voiceCharacter][type];
    const sound = sounds[Math.floor(Math.random() * sounds.length)];
    sound.currentTime = 0;
    sound.play().catch((error) => console.error("進行ボイスを再生できませんでした。", error));
}
