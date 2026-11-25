"use strict";
var CharacterPicker;
(function (CharacterPicker) {
    var _a;
    const characterDialogue = document.getElementById("characterPicker");
    const charactersContainer = document.getElementById("charactersContainer");
    const stickerImageL = document.getElementById("winStickerL");
    const stickerImageR = document.getElementById("winStickerR");
    const characterKey = "chosenCharacter";
    let chosenCharacter;
    let madePicker;
    function SetThemeCharacter(characterId) {
        const character = characters[characterId - 1];
        chosenCharacter = character;
        document.documentElement.style.setProperty("--colour-primary", character.colour);
        SetStickers();
        localStorage.setItem(characterKey, characterId.toString());
    }
    CharacterPicker.SetThemeCharacter = SetThemeCharacter;
    function SetStickers() {
        try {
            let stickerURL = ChooseSticker(Game.guessCount);
            stickerImageL.src = stickerURL;
            stickerImageR.src = stickerURL;
        }
        catch (_a) {
        }
    }
    CharacterPicker.SetStickers = SetStickers;
    function ChooseSticker(guessCount) {
        let stickerCharacter;
        if (chosenCharacter.hasStickers) {
            stickerCharacter = chosenCharacter;
        }
        else {
            stickerCharacter = characters[20];
        }
        const base = stickerCharacter.GetCharacterStickerBaseURL();
        let additional = "";
        if (guessCount <= 1) {
            additional = "first";
        }
        else if (guessCount >= 2 && guessCount <= 4) {
            additional = "low";
        }
        else if (guessCount >= 5 && guessCount <= 8) {
            additional = "high";
        }
        else if (guessCount >= 9) {
            additional = "fail";
        }
        return base + additional + ".png";
    }
    function MakePicker() {
        madePicker = true;
        characters.forEach(c => {
            const button = document.createElement("button");
            button.className = "characterPickerButton";
            button.innerHTML = "<img class='characterPickerButtonImage' src='" + c.GetCharacterImageURL() + "'>";
            button.addEventListener("click", () => {
                SetThemeCharacter(c.characterId);
                characterDialogue.close();
            });
            charactersContainer.appendChild(button);
        });
    }
    function ShowPicker() {
        if (!madePicker) {
            MakePicker();
        }
        characterDialogue.showModal();
    }
    CharacterPicker.ShowPicker = ShowPicker;
    characterDialogue.addEventListener("click", () => { characterDialogue.close(); });
    let stored = parseInt((_a = localStorage.getItem(characterKey)) !== null && _a !== void 0 ? _a : "0");
    if (stored <= 0 || stored >= 27) {
        SetThemeCharacter(21);
    }
    else {
        SetThemeCharacter(stored);
    }
})(CharacterPicker || (CharacterPicker = {}));
