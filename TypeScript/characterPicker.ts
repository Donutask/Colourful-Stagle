namespace CharacterPicker {
    const characterDialogue = document.getElementById("characterPicker") as HTMLDialogElement;
    const charactersContainer = document.getElementById("charactersContainer") as HTMLElement;

    const metaThemeColour = document.getElementById("metaThemeColour") as HTMLMetaElement;

    const stickerImageL = document.getElementById("winStickerL") as HTMLImageElement;
    const stickerImageR = document.getElementById("winStickerR") as HTMLImageElement;

    const characterKey = "chosenCharacter";

    //Character that themes the site
    let chosenCharacter: Character;
    let madePicker: boolean;

    export function SetThemeCharacter(characterId: number) {
        // Array indexed at 0, characterId indexed at 1
        const character = characters[characterId - 1];

        chosenCharacter = character;
        document.documentElement.style.setProperty("--colour-primary", character.colour);
        metaThemeColour.content = character.colour;

        SetStickers();

        localStorage.setItem(characterKey, characterId.toString());
    }

    export function SetStickers() {
        try {
            let stickerURL = ChooseSticker(Game.guessCount);
            stickerImageL.src = stickerURL;
            stickerImageR.src = stickerURL;
        } catch {
            // Game is not defined when doing this on start up, but i dont care
        }
    }

    function ChooseSticker(guessCount: number): string {

        let stickerCharacter: Character;
        if (chosenCharacter) {
            stickerCharacter = chosenCharacter;
        } else {
            // Use Miku if it doesn't have stickers.
            stickerCharacter = characters[20];
        }

        const base = stickerCharacter.GetCharacterStickerBaseURL();

        let additional = "";
        if (guessCount <= 1) {
            additional = "first";
        } else if (guessCount >= 2 && guessCount <= 4) {
            additional = "low";
        } else if (guessCount >= 5 && guessCount <= 8) {
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
            button.innerHTML = "<img class='characterPickerButtonImage' src='" + c.GetCharacterImageURL() + "'>"
            button.addEventListener("click", () => {
                SetThemeCharacter(c.characterId); characterDialogue.close();
            })

            charactersContainer.appendChild(button);
        });

    }

    export function ShowPicker() {
        if (!madePicker) {
            MakePicker();
        }

        characterDialogue.showModal();
    }

    // Load chosen when script loads
    let stored = parseInt(localStorage.getItem(characterKey) ?? "0");
    if (stored <= 0 || stored >= 27) {
        // Default to Miku
        SetThemeCharacter(21);
    } else {
        SetThemeCharacter(stored);
    }
}