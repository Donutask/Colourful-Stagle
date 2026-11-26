"use strict";
var Game;
(function (Game) {
    const contentContainer = document.getElementById("content");
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
    const dailyContainer = document.getElementById("dailyContainer");
    const playAgainButton = document.getElementById("newGame");
    const dailyDayLabel = document.getElementById("dayLabel");
    Game.aboutDialogue = document.getElementById("aboutDialogue");
    const unitFilterButton = document.getElementById("unitFilterButton");
    Game.musicBaseURL = "https://pjsk.cleista.cc/api/asset/en/music/short/";
    Game.jacketBaseURL = "https://assets.cleista.cc/en/music/jacket/";
    const startPlaybackSeconds = 1;
    const dailyCompletionKey = "dailyCompletionDate";
    const dailyGuessesKey = "dailyGuessCount";
    Game.unitFilterKey = "unitFilters";
    const testingMode = true;
    const loggingMode = false;
    let chosenSong;
    Game.guessCount = 0;
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
        let songsToSelectFrom;
        if (SongFilter.HasFilter()) {
            songsToSelectFrom = SongFilter.GetFilteredSongs();
        }
        else {
            songsToSelectFrom = songs;
        }
        return songsToSelectFrom[Math.floor(Math.random() * songsToSelectFrom.length)];
    }
    function Guess() {
        Game.guessCount++;
        if (Game.guessCount >= 9) {
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
            ChoicesManager.choices.removeChoice(songId);
        }
        guessList.appendChild(element);
        DeselectSong();
    }
    Game.Guess = Guess;
    function DeselectSong() {
        if (ChoicesManager.choices != null) {
            ChoicesManager.songChoicesElement.value = "";
            ChoicesManager.choices.removeActiveItems();
        }
        Game.guessButton.innerText = "Skip";
    }
    function GrantHints() {
        if (Game.guessCount == 1) {
            currentAllowedPlaybackSeconds += 2;
        }
        else if (Game.guessCount == 2) {
            currentAllowedPlaybackSeconds += 2;
        }
        else if (Game.guessCount == 3) {
            currentAllowedPlaybackSeconds += 5;
        }
        else if (Game.guessCount == 4) {
            currentAllowedPlaybackSeconds += 5;
        }
        else if (Game.guessCount == 5) {
            currentAllowedPlaybackSeconds = Math.ceil(audioPlayer.duration);
        }
        else if (Game.guessCount == 6) {
            ChoicesManager.FilterChoicesToUnits([chosenSong.unit]);
        }
        else if (Game.guessCount == 7) {
            artworkViewerButton.classList.remove("hidden");
            artworkDialogueImg.src = chosenSong.GetJacketURL();
        }
        UpdateHintsStatus();
    }
    function UpdateHintsStatus() {
        const firstPart = `You can listen to the first ${currentAllowedPlaybackSeconds}s. `;
        if (Game.guessCount == 0 || Game.guessCount == 1) {
            hintStatusText.innerText = `You can listen to the first second. Next guess will give +2s`;
        }
        else if (Game.guessCount == 2 || Game.guessCount == 3) {
            hintStatusText.innerText = firstPart + `Next guess will give +5s`;
        }
        else if (Game.guessCount == 4) {
            hintStatusText.innerText = firstPart + `Next guess will give the full excerpt.`;
        }
        else if (Game.guessCount == 5) {
            hintStatusText.innerText = `You can listen to the full excerpt. Next guess will give the unit.`;
        }
        else if (Game.guessCount == 6) {
            hintStatusText.innerText = `Unit: ${chosenSong.GetUnitDisplayName()}. Next guess will give the artwork.`;
        }
        else if (Game.guessCount == 7) {
            hintStatusText.innerText = `Unit: ${chosenSong.GetUnitDisplayName()}. 2 guesses until end of round.`;
        }
        else if (Game.guessCount == 8) {
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
    Game.ViewArtwork = ViewArtwork;
    function HideArtwork() {
        artworkDialogue.close();
    }
    Game.HideArtwork = HideArtwork;
    function MakeResultsScreen() {
        gameScreen.classList.add("hidden");
        guessInterface.classList.add("hidden");
        winScreen.classList.remove("hidden");
        artworkViewerButton.classList.add("hidden");
        hintStatusText.classList.add("hidden");
        contentContainer.style.setProperty("height", "100%");
        currentAllowedPlaybackSeconds = 9999;
        hintStatusText.innerHTML = "";
        if (Game.guessCount >= 9) {
            winHeading.innerHTML = `The song was...`;
        }
        else {
            if (Game.guessCount == 1) {
                winHeading.innerHTML = 'You got the song in just one guess!';
            }
            else if (Game.guessCount <= 0) {
                winHeading.innerHTML = `You somehow got the song in <b>${Game.guessCount}</b> guesses.`;
            }
            else {
                winHeading.innerHTML = `You got the song in <b>${Game.guessCount}</b> guesses` + (Game.guessCount <= 5 ? "!" : ".");
            }
        }
        winTitle.textContent = chosenSong.displayName;
        if (testingMode) {
            winImage.src = "Images/loading_jacket.svg";
        }
        else {
            winImage.src = chosenSong.GetJacketURL();
        }
        CharacterPicker.SetStickers();
        if (unlimitedMode || testingMode) {
            dailyContainer.classList.add("hidden");
            if (testingMode) {
                playAgainButton.textContent = "Keep Testing";
            }
            else {
                playAgainButton.textContent = "New Song";
            }
        }
        else {
            dailyContainer.classList.remove("hidden");
            dailyDayLabel.textContent = GetDay().toString();
            playAgainButton.textContent = "Play Unlimited";
            if (!hasDoneDaily) {
                localStorage.setItem(dailyCompletionKey, new Date().toISOString());
                localStorage.setItem(dailyGuessesKey, Game.guessCount.toString());
                hasDoneDaily = true;
            }
        }
    }
    function NewGame() {
        if (testingMode || (hasDoneDaily && !unlimitedMode)) {
            unlimitedMode = true;
        }
        audioPlayer.hidden = true;
        loadingText.hidden = false;
        guessList.innerHTML = "";
        hintStatusText.innerText = "";
        hintStatusText.classList.remove("hidden");
        Game.guessButton.disabled = true;
        artworkDialogueImg.src = "";
        loadingText.innerText = "Loading song. Please wait...";
        loadingText.classList.remove("hidden");
        loadingText.classList.add("loadingAnimated");
        artworkViewerButton.classList.add("hidden");
        contentContainer.style.setProperty("height", "100dvh");
        currentAllowedPlaybackSeconds = startPlaybackSeconds;
        Game.guessCount = 0;
        DeselectSong();
        if (SongFilter.HasFilter()) {
            ChoicesManager.ResetChoices();
        }
        else {
            ChoicesManager.FilterChoicesToUnits(SongFilter.unitFilters);
        }
        if (testingMode) {
            chosenSong = songs.filter(({ id }) => id == 184)[0];
        }
        else {
            if (unlimitedMode) {
                chosenSong = GetRandomSong();
            }
            else {
                chosenSong = GetDailySong();
            }
        }
        if (loggingMode) {
            console.log(chosenSong);
        }
        if (testingMode) {
            gameTitle.textContent = "Test Mode";
            audioPlayer.src = "Audio/hello_world.mp3";
        }
        else {
            audioPlayer.src = chosenSong.GetAudioURL();
        }
        audioPlayer.currentTime = 0;
        if (unlimitedMode) {
            unitFilterButton.classList.remove("hidden");
        }
        else {
            unitFilterButton.classList.add("hidden");
        }
        gameScreen.classList.remove("hidden");
        guessInterface.classList.remove("hidden");
        winScreen.classList.add("hidden");
        winImage.src = "Images/loading_jacket.svg";
    }
    Game.NewGame = NewGame;
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
        var _a, _b;
        winScreen.hidden = false;
        artworkViewerButton.hidden = false;
        let unitFilterJson = (_a = localStorage.getItem(Game.unitFilterKey)) !== null && _a !== void 0 ? _a : "[]";
        SongFilter.unitFilters = JSON.parse(unitFilterJson);
        NewGame();
        CheckLastDoneDate();
        if (hasDoneDaily && !testingMode) {
            Game.guessCount = parseInt((_b = localStorage.getItem(dailyGuessesKey)) !== null && _b !== void 0 ? _b : "0");
            MakeResultsScreen();
        }
        ChoicesManager.MakeChoices();
    });
    document.getElementById("lastUpdated").innerText = "Song List Last Updated: " + SONGS_LAST_UPDATED;
})(Game || (Game = {}));
