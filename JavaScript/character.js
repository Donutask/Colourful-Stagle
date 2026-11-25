"use strict";
class Character {
    constructor(characterId, fullName, shortName, colour, unit, hasStickers = false) {
        this.characterId = characterId;
        this.fullName = fullName;
        this.shortName = shortName;
        this.colour = colour;
        this.hasStickers = hasStickers;
        this.unit = unit;
    }
    GetCharacterImageURL() {
        return "Images/character/" + this.characterId + ".png";
    }
    GetCharacterStickerBaseURL() {
        return "Images/stickers/" + this.characterId + "/";
    }
}
