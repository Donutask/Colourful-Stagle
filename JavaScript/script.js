"use strict";
var Game;
(function (Game) {
    const gameScreen = document.getElementById("gameContainer");
    const gameTitle = document.getElementById("title");
    const guessInterface = document.getElementById("guessingInterface");
    const audioPlayer = document.getElementById("audio");
    const loadingText = document.getElementById("loadingMusic");
    const hintStatusText = document.getElementById("status");
    const guessList = document.getElementById("guesses");
    Game.guessButton = document.getElementById("guessButton");
    const artworkViewerButton = document.getElementById("viewArtworkButton");
    const artworkDialogue = document.getElementById("jacketViewer");
    const artworkDialogueImg = document.getElementById("jacketViewerImg");
    const winScreen = document.getElementById("winContainer");
    const winHeading = document.getElementById("winText");
    const winImage = document.getElementById("winSongImg");
    const winTitle = document.getElementById("winSongTitle");
    const stickerImageL = document.getElementById("winStickerL");
    const stickerImageR = document.getElementById("winStickerR");
    const dailyContainer = document.getElementById("dailyContainer");
    const playAgainButton = document.getElementById("newGame");
    const dailyDayLabel = document.getElementById("dayLabel");
    Game.musicBaseURL = "https://pjsk.cleista.cc/api/asset/en/music/short/";
    Game.jacketBaseURL = "https://assets.cleista.cc/en/music/jacket/";
    const startPlaybackSeconds = 1;
    const gameName = "Colorful Stagle!";
    const dailyCompletionKey = "dailyCompletionDate";
    const dailyGuessesKey = "dailyGuessCount";
    const testingMode = false;
    const loggingMode = false;
    let chosenSong;
    let guessCount = 0;
    let currentAllowedPlaybackSeconds = 1;
    let unlimitedMode = false;
    let hasDoneDaily = false;
    function GetDay() {
        const epochOffset = 20772;
        let daysSinceEpoch = Math.floor(Date.now() / 8.64e7);
        return daysSinceEpoch - epochOffset;
    }
    function GetDailySong() {
        let songId = randomSongIds[GetDay() % randomSongIds.length];
        return songs.filter(({ id }) => id == songId)[0];
    }
    function GetRandomSong() {
        return songs[Math.floor(Math.random() * songs.length)];
    }
    function Guess() {
        guessCount++;
        if (guessCount >= 9) {
            MakeResultsScreen();
            return;
        }
        GrantHints();
        const element = document.createElement("li");
        element.className = "guess";
        if (ChoicesManager.songChoicesElement.value == "") {
            element.textContent = "Skipped";
        }
        else {
            let songId = parseInt(ChoicesManager.songChoicesElement.value);
            if (songId == chosenSong.id) {
                MakeResultsScreen();
                return;
            }
            else {
                element.textContent = songs.filter(({ id }) => id == songId)[0].displayName;
            }
        }
        guessList.appendChild(element);
        DeselectSong();
    }
    function DeselectSong() {
        ChoicesManager.songChoicesElement.value = "";
        ChoicesManager.choices.removeActiveItems();
        Game.guessButton.innerText = "Skip";
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
        else if (guessCount == 7) {
            hintStatusText.innerText = `Unit: ${chosenSong.GetUnitDisplayName()}. 2 guesses until end of round.`;
        }
        else if (guessCount == 8) {
            hintStatusText.innerText = `Unit: ${chosenSong.GetUnitDisplayName()}. Next guess will end the round.`;
        }
        else {
            hintStatusText.innerText = "";
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
    function MakeResultsScreen() {
        gameScreen.classList.add("hidden");
        guessInterface.classList.add("hidden");
        winScreen.classList.remove("hidden");
        artworkViewerButton.classList.add("hidden");
        hintStatusText.classList.add("hidden");
        currentAllowedPlaybackSeconds = 9999;
        hintStatusText.innerHTML = "";
        if (guessCount >= 9) {
            winHeading.innerHTML = `The song was...`;
        }
        else {
            if (guessCount == 1) {
                winHeading.innerHTML = 'You got the song in just one guess!';
            }
            else if (guessCount <= 0) {
                winHeading.innerHTML = `You somehow got the song in <b>${guessCount}</b> guesses.`;
            }
            else {
                winHeading.innerHTML = `You got the song in <b>${guessCount}</b> guesses` + (guessCount <= 5 ? "!" : ".");
            }
        }
        winTitle.textContent = chosenSong.displayName;
        winImage.src = chosenSong.GetJacketURL();
        let stickerURL = ChooseSticker();
        stickerImageL.src = stickerURL;
        stickerImageR.src = stickerURL;
        if (unlimitedMode) {
            dailyContainer.classList.add("hidden");
            playAgainButton.textContent = "New Song";
        }
        else {
            dailyContainer.classList.remove("hidden");
            dailyDayLabel.textContent = GetDay().toString();
            playAgainButton.textContent = "Play Unlimited";
            if (!hasDoneDaily) {
                localStorage.setItem(dailyCompletionKey, new Date().toISOString());
                localStorage.setItem(dailyGuessesKey, guessCount.toString());
                hasDoneDaily = true;
            }
        }
    }
    function ChooseSticker() {
        const baseURL = "Images/stickers/emu/";
        let fileName = "";
        if (guessCount == 1) {
            fileName = "wonderhoy";
        }
        else if (guessCount == 2) {
            fileName = "yay-yay";
        }
        else if (guessCount == 3) {
            fileName = "hurray-hurray";
        }
        else if (guessCount == 4 || guessCount == 5) {
            fileName = "that-was-fun";
        }
        else if (guessCount >= 6 && guessCount <= 8) {
            fileName = "mmmmm";
        }
        else if (guessCount >= 9) {
            fileName = "gotta-study";
        }
        else {
            fileName = "whaaat";
        }
        return baseURL + fileName + ".png";
    }
    function NewGame() {
        if (hasDoneDaily && !unlimitedMode) {
            unlimitedMode = true;
        }
        audioPlayer.hidden = true;
        loadingText.hidden = false;
        guessList.innerHTML = "";
        hintStatusText.innerText = "";
        hintStatusText.classList.remove("hidden");
        DeselectSong();
        Game.guessButton.disabled = true;
        artworkDialogueImg.src = "";
        loadingText.innerText = "Loading song. Please wait...";
        loadingText.classList.remove("hidden");
        loadingText.classList.add("loadingAnimated");
        artworkViewerButton.classList.add("hidden");
        currentAllowedPlaybackSeconds = startPlaybackSeconds;
        guessCount = 0;
        if (unlimitedMode) {
            chosenSong = GetRandomSong();
        }
        else {
            chosenSong = GetDailySong();
        }
        if (loggingMode) {
            console.log(chosenSong);
        }
        if (testingMode) {
            loadingText.innerText = "Testing mode enabled. No song will load.";
            loadingText.classList.remove("loadingAnimated");
            UpdateHintsStatus();
            Game.guessButton.disabled = false;
        }
        else {
            audioPlayer.src = chosenSong.GetAudioURL();
            audioPlayer.currentTime = 0;
        }
        gameScreen.classList.remove("hidden");
        guessInterface.classList.remove("hidden");
        winScreen.classList.add("hidden");
        winImage.src = "Images/loading_jacket.svg";
        ShowTitle();
    }
    function ShowTitle() {
        if (unlimitedMode) {
            gameTitle.textContent = "Unlimited " + gameName;
        }
        else {
            gameTitle.textContent = "Daily " + gameName;
        }
    }
    function CheckLastDoneDate() {
        let lastDoneValue = localStorage.getItem(dailyCompletionKey);
        if (lastDoneValue) {
            const lastDoneDate = new Date(lastDoneValue);
            const now = new Date();
            if (lastDoneDate.getFullYear() == now.getFullYear()
                && lastDoneDate.getMonth() == now.getMonth()
                && lastDoneDate.getDate() == now.getDate()) {
                hasDoneDaily = true;
            }
        }
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
        loadingText.classList.add("hidden");
        audioPlayer.hidden = false;
        UpdateHintsStatus();
        Game.guessButton.disabled = false;
    });
    window.addEventListener("load", () => {
        var _a;
        ChoicesManager.MakeChoices();
        NewGame();
        CheckLastDoneDate();
        if (hasDoneDaily) {
            guessCount = parseInt((_a = localStorage.getItem(dailyGuessesKey)) !== null && _a !== void 0 ? _a : "0");
            MakeResultsScreen();
        }
    });
})(Game || (Game = {}));
