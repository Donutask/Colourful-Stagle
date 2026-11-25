class Character {
    unit: Unit
    constructor(
        public characterId: number,
        public fullName: string,
        public shortName: string,
        public colour: string,
        unit: string,
    ) {
        this.unit = unit as Unit;
    }

    GetCharacterImageURL() {
        return "Images/character/" + this.characterId + ".png"
    }

    GetCharacterStickerBaseURL() {
        return "Images/stickers/" + this.characterId + "/";
    }
}