"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var ProcessData;
(function (ProcessData_1) {
    let musics;
    let musicVocals;
    let musicTags;
    let processedSongs;
    function DownloadFromDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            const baseDataSourceURL = "https://raw.githubusercontent.com/Sekai-World/sekai-master-db-en-diff/refs/heads/main/";
            const musicsFileName = "musics.json";
            const musicsTagsFileName = "musicTags.json";
            const musicsVocalsFileName = "musicVocals.json";
            let response;
            console.log("Musics");
            response = yield fetch(baseDataSourceURL + musicsFileName);
            DownloadFile(musicsFileName, yield response.text());
            console.log("Music Tags");
            response = yield fetch(baseDataSourceURL + musicsTagsFileName);
            DownloadFile(musicsTagsFileName, yield response.text());
            console.log("Music Vocals");
            response = yield fetch(baseDataSourceURL + musicsVocalsFileName);
            DownloadFile(musicsVocalsFileName, yield response.text());
        });
    }
    ProcessData_1.DownloadFromDatabase = DownloadFromDatabase;
    function LoadJSON() {
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            console.log("Musics");
            response = yield fetch("JSON/musics.json");
            musics = yield response.json();
            console.log(musics);
            console.log("Music Tags");
            response = yield fetch("JSON/musicTags.json");
            musicTags = yield response.json();
            console.log(musicTags);
            console.log("Music Vocals");
            response = yield fetch("JSON/musicVocals.json");
            musicVocals = yield response.json();
            console.log(musicVocals);
        });
    }
    ProcessData_1.LoadJSON = LoadJSON;
    function ProcessData() {
        processedSongs = [];
        musics.forEach(element => {
            let song = new Song(element.id, element.title, element.pronunciation, GetSongTag(element.id), GetAssetbundleName(element.id));
            processedSongs.push(song);
        });
        console.log("Processed Songs");
        console.log(processedSongs);
    }
    ProcessData_1.ProcessData = ProcessData;
    function GetSongTag(id) {
        const filtered = musicTags.filter(({ musicId, musicTag }) => musicId == id && musicTag != "all");
        let uniqueItems = [...new Set(filtered)];
        if (uniqueItems.length == 1) {
            return uniqueItems[0].musicTag;
        }
        else {
            uniqueItems = uniqueItems.filter(({ musicTag }) => musicTag != 'vocaloid' && musicTag != 'other');
            if (uniqueItems.length == 0) {
                return Unit.other;
            }
            else if (uniqueItems.length == 1) {
                return uniqueItems[0].musicTag;
            }
            else {
                return Unit.all;
            }
        }
    }
    function GetAssetbundleName(id) {
        const sekaiVocalInfo = musicVocals.find(({ musicId, musicVocalType }) => musicId == id && musicVocalType == "sekai");
        if (sekaiVocalInfo) {
            return sekaiVocalInfo.assetbundleName;
        }
        else {
            const otherVocalInfo = musicVocals.find(({ musicId }) => musicId == id);
            if (otherVocalInfo) {
                return otherVocalInfo.assetbundleName;
            }
            else {
                alert("error soz");
                return "ERROR: couldn't get vocal information";
            }
        }
    }
    function MakeAndDownloadFile() {
        DownloadFile("songList.ts", MakeScriptText(processedSongs));
    }
    ProcessData_1.MakeAndDownloadFile = MakeAndDownloadFile;
    function MakeScriptText(songs) {
        let text = `const SONGS_LAST_UPDATED = "${new Date().toDateString()}";\nconst songs: Song[] = [\n`;
        songs.forEach(item => {
            let line = `new Song(${item.id}, \`${item.displayName}\`, "${item.pronunciation}", "${item.unit}", "${item.assetbundleName}"),\n`;
            text += line;
        });
        text += "];";
        return text;
    }
    function DownloadFile(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
})(ProcessData || (ProcessData = {}));
