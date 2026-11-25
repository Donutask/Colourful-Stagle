namespace Game {
    // HTML ELEMENTS
    const contentContainer = document.getElementById("content") as HTMLElement;
    const gameScreen = document.getElementById("gameContainer") as HTMLElement;
    const gameTitle = document.getElementById("title") as HTMLElement;
    const guessInterface = document.getElementById("guessingInterface") as HTMLElement;
    const audioPlayer = document.getElementById("audio") as HTMLAudioElement;
    const loadingText = document.getElementById("loadingMusic") as HTMLElement;
    const hintStatusText = document.getElementById("status") as HTMLElement;
    const guessList = document.getElementById("guesses") as HTMLElement;
    export const guessButton = document.getElementById("guessButton") as HTMLButtonElement;

    const artworkViewerButton = document.getElementById("viewArtworkButton") as HTMLButtonElement;
    const artworkDialogue = document.getElementById("jacketViewer") as HTMLDialogElement;
    const artworkDialogueImg = document.getElementById("jacketViewerImg") as HTMLImageElement;

    const winScreen = document.getElementById("winContainer") as HTMLElement;
    const winHeading = document.getElementById("winText") as HTMLElement;
    const winImage = document.getElementById("winSongImg") as HTMLImageElement;
    const winTitle = document.getElementById("winSongTitle") as HTMLElement;

    const dailyContainer = document.getElementById("dailyContainer") as HTMLElement;
    const playAgainButton = document.getElementById("newGame") as HTMLButtonElement;
    const dailyDayLabel = document.getElementById("dayLabel") as HTMLElement;

    export const aboutDialogue = document.getElementById("aboutDialogue") as HTMLDialogElement;

    // CONSTANTS
    export const musicBaseURL = "https://pjsk.cleista.cc/api/asset/en/music/short/";
    export const jacketBaseURL = "https://assets.cleista.cc/en/music/jacket/"
    const startPlaybackSeconds = 1;
    const gameName = "Colorful Stagle!"
    const dailyCompletionKey = "dailyCompletionDate";
    const dailyGuessesKey = "dailyGuessCount";

    // DEBUGGING
    const testingMode = false;
    const loggingMode = false;

    // GAME PARAMETERS
    let chosenSong: Song;
    export let guessCount: number = 0;
    let currentAllowedPlaybackSeconds = 1;
    let unlimitedMode = false;
    let hasDoneDaily = false;


    // Day since release of game
    function GetDay() {
        const epochOffset = 20772;
        let daysSinceEpoch = Math.floor(Date.now() / 8.64e7);
        return daysSinceEpoch - epochOffset;
    }

    function GetDailySong(): Song {
        let songId = randomSongIds[GetDay() % randomSongIds.length];
        return songs.filter(({ id }) => id == songId)[0];
    }

    function GetRandomSong(): Song {
        return songs[Math.floor(Math.random() * songs.length)];
    }

    export function Guess() {
        guessCount++;
        if (guessCount >= 9) {
            MakeResultsScreen();
            return;
        }
        GrantHints();

        const element = document.createElement("li");
        element.className = "guess";

        if (ChoicesManager.songChoicesElement.value == "") {
            element.textContent = "Skipped"
        } else {
            let songId = parseInt(ChoicesManager.songChoicesElement.value);

            if (songId == chosenSong.id) {
                MakeResultsScreen();
                return;
            } else {
                element.textContent = songs.filter(({ id }) => id == songId)[0].displayName;
            }

            // If I remove them, then it won't be there for next song.
            ChoicesManager.choices.removeChoice(songId);
        }

        guessList.appendChild(element);
        DeselectSong();
    }

    function DeselectSong() {
        if (ChoicesManager.choices != null) {
            ChoicesManager.songChoicesElement.value = ""
            ChoicesManager.choices.removeActiveItems();
        }
        guessButton.innerText = "Skip";
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
        } else if (guessCount == 6) {
            // unit
            ChoicesManager.FilterChoicesToUnit(chosenSong.unit);
        } else if (guessCount == 7) {
            // cover
            artworkViewerButton.classList.remove("hidden");
            artworkDialogueImg.src = chosenSong.GetJacketURL();
        }

        UpdateHintsStatus();
    }

    function UpdateHintsStatus() {
        const firstPart = `You can listen to the first ${currentAllowedPlaybackSeconds}s. `;

        if (guessCount == 0 || guessCount == 1) {
            hintStatusText.innerText = `You can listen to the first second. Next guess will give +2s`
        }
        else if (guessCount == 2 || guessCount == 3) {
            hintStatusText.innerText = firstPart + `Next guess will give +5s`
        }
        else if (guessCount == 4) {
            hintStatusText.innerText = firstPart + `Next guess will give the full excerpt.`
        }
        else if (guessCount == 5) {
            hintStatusText.innerText = `You can listen to the full excerpt. Next guess will give the unit.`
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

    export function ViewArtwork() {
        artworkDialogue.showModal();
        if (artworkDialogueImg.src != "") {
            artworkDialogueImg.src = chosenSong.GetJacketURL();
        }
    }

    export function HideArtwork() {
        artworkDialogue.close();
    }

    function MakeResultsScreen() {
        gameScreen.classList.add("hidden");
        guessInterface.classList.add("hidden");
        winScreen.classList.remove("hidden");
        artworkViewerButton.classList.add("hidden");
        hintStatusText.classList.add("hidden");
        contentContainer.style.setProperty("height", "100%");

        currentAllowedPlaybackSeconds = 9999;
        hintStatusText.innerHTML = "";

        if (guessCount >= 9) {
            winHeading.innerHTML = `The song was...`;
        } else {
            if (guessCount == 1) {
                winHeading.innerHTML = 'You got the song in just one guess!';
            } else if (guessCount <= 0) {
                winHeading.innerHTML = `You somehow got the song in <b>${guessCount}</b> guesses.`;
            } else {
                winHeading.innerHTML = `You got the song in <b>${guessCount}</b> guesses` + (guessCount <= 5 ? "!" : ".");
            }
        }

        winTitle.textContent = chosenSong.displayName;
        winImage.src = chosenSong.GetJacketURL();

        CharacterPicker.SetStickers();

        if (unlimitedMode) {
            dailyContainer.classList.add("hidden");
            playAgainButton.textContent = "New Song";
        } else {
            dailyContainer.classList.remove("hidden");
            dailyDayLabel.textContent = GetDay().toString();
            playAgainButton.textContent = "Play Unlimited";

            if (!hasDoneDaily) {
                localStorage.setItem(dailyCompletionKey, new Date().toISOString())
                localStorage.setItem(dailyGuessesKey, guessCount.toString())

                hasDoneDaily = true;
            }
        }
    }

    // Artwork image for current song
    export function NewGame() {
        if (hasDoneDaily && !unlimitedMode) {
            unlimitedMode = true;
        }

        audioPlayer.hidden = true;
        loadingText.hidden = false;
        guessList.innerHTML = "";
        hintStatusText.innerText = "";
        hintStatusText.classList.remove("hidden");
        guessButton.disabled = true;
        artworkDialogueImg.src = "";
        loadingText.innerText = "Loading song. Please wait...";
        loadingText.classList.remove("hidden");
        loadingText.classList.add("loadingAnimated")
        artworkViewerButton.classList.add("hidden");
        contentContainer.style.setProperty("height", "100dvh");

        currentAllowedPlaybackSeconds = startPlaybackSeconds;
        guessCount = 0;

        DeselectSong();
        ChoicesManager.ResetChoices();

        if (unlimitedMode) {
            chosenSong = GetRandomSong();
        } else {
            chosenSong = GetDailySong();
        }
        if (loggingMode) { console.log(chosenSong); }

        if (testingMode) {
            loadingText.innerText = "Testing mode enabled. No song will load."
            loadingText.classList.remove("loadingAnimated")
            UpdateHintsStatus();
            guessButton.disabled = false;
        } else {
            audioPlayer.src = chosenSong.GetAudioURL();
            audioPlayer.currentTime = 0;
        }

        gameScreen.classList.remove("hidden");
        guessInterface.classList.remove("hidden");
        winScreen.classList.add("hidden");
        winImage.src = "Images/loading_jacket.svg"

        ShowTitle();
    }

    function ShowTitle() {
        if (unlimitedMode) {
            gameTitle.textContent = gameName;
        } else {
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

    // Restrict playback to small parts
    audioPlayer.addEventListener("timeupdate", () => {
        if (audioPlayer.currentTime > currentAllowedPlaybackSeconds) {
            audioPlayer.currentTime = currentAllowedPlaybackSeconds;
            audioPlayer.pause();
        }
    })

    // Play the start if attempting to play again at the end
    audioPlayer.addEventListener("play", () => {
        if (audioPlayer.currentTime >= (currentAllowedPlaybackSeconds - 1)) {
            audioPlayer.currentTime = 0;
        }
    })

    // Hide loading when done loading
    audioPlayer.addEventListener("loadeddata", () => {
        loadingText.innerText = "";
        loadingText.classList.remove("loadingAnimated");
        loadingText.classList.add("hidden");
        audioPlayer.hidden = false;
        UpdateHintsStatus();
        guessButton.disabled = false;
    });

    // When page loads, get a song
    window.addEventListener("load", () => {
        // some elements hidden from DOM when page is loading
        winScreen.hidden = false;
        artworkViewerButton.hidden = false;

        NewGame();

        CheckLastDoneDate();
        if (hasDoneDaily) {
            guessCount = parseInt(localStorage.getItem(dailyGuessesKey) ?? "0");
            MakeResultsScreen();
        }

        ChoicesManager.MakeChoices();
    });

    (document.getElementById("lastUpdated") as HTMLElement).innerText = "Song List Last Updated: " + SONGS_LAST_UPDATED;
}