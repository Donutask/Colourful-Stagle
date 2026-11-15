class Song {
    id: number;
    displayName: string;
    pronunciation: string;
    unit: Unit;
    assetbundleName: string;

    constructor(id: number, name: string, pronunciation: string, unit: Unit, assetbundleName: string) {
        this.id = id;
        this.unit = unit;
        this.displayName = name;
        this.pronunciation = pronunciation;
        this.assetbundleName = assetbundleName;
    }

    public GetUnitDisplayName() {
        switch (this.unit) {
            case Unit.vocaloid:
                return "Virtual Singer";
            case Unit.idol:
                return "More More Jump";
            case Unit.street:
                return "Vivid Bad Squad";
            case Unit.theme_park:
                return "Wonderlands X Showtime";
            case Unit.light_music_club:
                return "Leo/need";
            case Unit.school_refusal:
                return "Nightcord at 25:00";
            case Unit.all:
                return "All";
            default:
                return "Other"
        }
    }

    // Artwork img
    public GetJacketURL() {
        // jacket ids need leading 0
        let jacketId = this.id < 100 ? "0" + this.id.toString() : this.id.toString();
        return jacketBaseURL + `jacket_s_${jacketId}/jacket_s_${jacketId}.webp`
    }

    // Short excerpt of the song
    public GetAudioURL() {
        return musicBaseURL + `${this.assetbundleName}/${this.assetbundleName}_short.mp3`;
    }
}

enum Unit {
    all = "all",
    other = "other",
    vocaloid = "vocaloid",
    idol = "idol",
    street = "street",
    theme_park = "theme_park",
    light_music_club = "light_music_club",
    school_refusal = "school_refusal"
}