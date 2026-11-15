"use strict";
const gameScreen = document.getElementById("gameContainer");
const guessInterface = document.getElementById("guessingInterface");
const winScreen = document.getElementById("winContainer");
const winHeading = document.getElementById("winText");
const winImage = document.getElementById("winSongImg");
const winTitle = document.getElementById("winSongTitle");
const audioPlayer = document.getElementById("audio");
const loadingText = document.getElementById("loadingMusic");
const hintStatusText = document.getElementById("status");
const guessList = document.getElementById("guesses");
const guessButton = document.getElementById("guessButton");
const artworkViewerButton = document.getElementById("viewArtworkButton");
const artworkDialogue = document.getElementById("jacketViewer");
const artworkDialogueImg = document.getElementById("jacketViewerImg");
const musicBaseURL = "https://pjsk.cleista.cc/api/asset/en/music/short/";
const jacketBaseURL = "https://assets.cleista.cc/en/music/jacket/";
const startPlaybackSeconds = 1;
const testingMode = false;
const loggingMode = true;
let chosenSong;
let guessCount = 0;
let currentAllowedPlaybackSeconds = 1;
let durationHints = -1;
let failed = false;
function ChooseRandomSong() {
    const song = songs[Math.floor(Math.random() * songs.length)];
    chosenSong = song;
    if (loggingMode) {
        console.log(song);
    }
    return song;
}
function Guess() {
    guessCount++;
    if (guessCount >= 10) {
        GiveUp();
        return;
    }
    GrantHints();
    const element = document.createElement("li");
    element.className = "guess";
    if (songChoicesElement.value == "") {
        element.textContent = "Skipped";
    }
    else {
        let songId = parseInt(songChoicesElement.value);
        if (songId == chosenSong.id) {
            MakeWinScreen();
            return;
        }
        else {
            element.textContent = songs.filter(({ id }) => id == songId)[0].displayName;
        }
        choices.removeChoice(songId);
    }
    guessList.appendChild(element);
    DeselectSong();
}
function DeselectSong() {
    songChoicesElement.value = "";
    choices.removeActiveItems();
    guessButton.innerText = "Skip";
}
function GiveUp() {
    failed = true;
    MakeWinScreen();
}
function GrantHints() {
    if (guessCount == 1) {
        currentAllowedPlaybackSeconds += 2;
    }
    else if (guessCount == 2) {
        currentAllowedPlaybackSeconds += 2;
    }
    else if (guessCount == 3) {
        currentAllowedPlaybackSeconds += 5;
    }
    else if (guessCount == 4) {
        currentAllowedPlaybackSeconds += 5;
    }
    else if (guessCount == 5) {
        currentAllowedPlaybackSeconds = Math.ceil(audioPlayer.duration);
    }
    else if (guessCount == 6) {
    }
    else if (guessCount == 7) {
        artworkViewerButton.classList.remove("hidden");
        artworkDialogueImg.src = chosenSong.GetJacketURL();
    }
    else if (guessCount == 8) {
    }
    UpdateHintsStatus();
}
function UpdateHintsStatus() {
    const firstPart = `You can listen to the first ${currentAllowedPlaybackSeconds}s. `;
    if (guessCount == 0 || guessCount == 1) {
        hintStatusText.innerText = `You can listen to the first second. Next guess will give +2s`;
    }
    else if (guessCount == 2 || guessCount == 3) {
        hintStatusText.innerText = firstPart + `Next guess will give +5s`;
    }
    else if (guessCount == 4) {
        hintStatusText.innerText = firstPart + `Next guess will give the full excerpt.`;
    }
    else if (guessCount == 5) {
        hintStatusText.innerText = `You can listen to the full excerpt. Next guess will give the unit.`;
    }
    else if (guessCount == 6) {
        hintStatusText.innerText = `Unit: ${chosenSong.GetUnitDisplayName()}. Next guess will give the artwork.`;
    }
    else if (guessCount == 9) {
        hintStatusText.innerText = `Unit: ${chosenSong.GetUnitDisplayName()}. Next guess will end the round.`;
    }
    else {
        hintStatusText.innerText = `Unit: ${chosenSong.GetUnitDisplayName()}.`;
    }
}
function ViewArtwork() {
    artworkDialogue.showModal();
    if (artworkDialogueImg.src != "") {
        artworkDialogueImg.src = chosenSong.GetJacketURL();
    }
}
function HideArtwork() {
    artworkDialogue.close();
}
function MakeWinScreen() {
    gameScreen.classList.add("hidden");
    guessInterface.classList.add("hidden");
    winScreen.classList.remove("hidden");
    artworkViewerButton.classList.add("hidden");
    currentAllowedPlaybackSeconds = 9999;
    hintStatusText.innerHTML = "";
    if (failed) {
        winHeading.innerHTML = `The song was...`;
    }
    else {
        if (guessCount == 1) {
            winHeading.innerHTML = 'Wonderhoy! You got the song in just one guess!';
        }
        else {
            winHeading.innerHTML = `You got the song in <b>${guessCount}</b> guesses` + (guessCount <= 5 ? "!" : ".");
        }
    }
    winTitle.textContent = chosenSong.displayName;
    winImage.src = chosenSong.GetJacketURL();
}
function NewGame() {
    audioPlayer.hidden = true;
    loadingText.hidden = false;
    guessList.innerHTML = "";
    hintStatusText.innerText = "";
    DeselectSong();
    guessButton.disabled = true;
    artworkDialogueImg.src = "";
    loadingText.innerText = "Loading song. Please wait...";
    loadingText.classList.add("loadingAnimated");
    artworkViewerButton.classList.add("hidden");
    currentAllowedPlaybackSeconds = startPlaybackSeconds;
    guessCount = 0;
    failed = false;
    ChooseRandomSong();
    if (testingMode) {
        loadingText.innerText = "Testing mode enabled. No song will load.";
        loadingText.classList.remove("loadingAnimated");
        durationHints = 0;
        UpdateHintsStatus();
        guessButton.disabled = false;
    }
    else {
        audioPlayer.src = chosenSong.GetAudioURL();
        audioPlayer.currentTime = 0;
    }
    gameScreen.classList.remove("hidden");
    guessInterface.classList.remove("hidden");
    winScreen.classList.add("hidden");
    winImage.src = "Images/loading_jacket.svg";
}
audioPlayer.addEventListener("timeupdate", () => {
    if (audioPlayer.currentTime > currentAllowedPlaybackSeconds) {
        audioPlayer.currentTime = currentAllowedPlaybackSeconds;
        audioPlayer.pause();
    }
});
audioPlayer.addEventListener("play", () => {
    if (audioPlayer.currentTime >= (currentAllowedPlaybackSeconds - 1)) {
        audioPlayer.currentTime = 0;
    }
});
audioPlayer.addEventListener("loadeddata", () => {
    loadingText.innerText = "";
    loadingText.classList.remove("loadingAnimated");
    audioPlayer.hidden = false;
    UpdateHintsStatus();
    guessButton.disabled = false;
});
window.addEventListener("load", () => {
    MakeChoices();
    NewGame();
});
