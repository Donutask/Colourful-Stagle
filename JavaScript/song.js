"use strict";
class Song {
    constructor(id, name, pronunciation, unit, assetbundleName) {
        this.id = id;
        this.unit = unit;
        this.displayName = name;
        this.pronunciation = pronunciation;
        this.assetbundleName = assetbundleName;
    }
    GetUnitDisplayName() {
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
                return "Other";
        }
    }
    GetJacketURL() {
        let jacketId = this.id < 100 ? "0" + this.id.toString() : this.id.toString();
        return jacketBaseURL + `jacket_s_${jacketId}/jacket_s_${jacketId}.webp`;
    }
    GetAudioURL() {
        return musicBaseURL + `${this.assetbundleName}/${this.assetbundleName}_short.mp3`;
    }
}
var Unit;
(function (Unit) {
    Unit["all"] = "all";
    Unit["other"] = "other";
    Unit["vocaloid"] = "vocaloid";
    Unit["idol"] = "idol";
    Unit["street"] = "street";
    Unit["theme_park"] = "theme_park";
    Unit["light_music_club"] = "light_music_club";
    Unit["school_refusal"] = "school_refusal";
})(Unit || (Unit = {}));
