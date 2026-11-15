
namespace ProcessData {
    let musics: Music[];
    let musicVocals: MusicVocal[];
    let musicTags: MusicTag[];
    let processedSongs: Song[];

    export async function DownloadFromDatabase() {
        const baseDataSourceURL = "https://raw.githubusercontent.com/Sekai-World/sekai-master-db-en-diff/refs/heads/main/";

        const musicsFileName = "musics.json";
        const musicsTagsFileName = "musicTags.json";
        const musicsVocalsFileName = "musicVocals.json";

        let response: Response;

        console.log("Musics")
        response = await fetch(baseDataSourceURL + musicsFileName);
        DownloadFile(musicsFileName, await response.text());

        console.log("Music Tags")
        response = await fetch(baseDataSourceURL + musicsTagsFileName);
        DownloadFile(musicsTagsFileName, await response.text());

        console.log("Music Vocals")
        response = await fetch(baseDataSourceURL + musicsVocalsFileName);
        DownloadFile(musicsVocalsFileName, await response.text());
    }

    export async function LoadJSON() {
        let response: Response;

        console.log("Musics")
        response = await fetch("JSON/musics.json");
        musics = await response.json();
        console.log(musics);

        console.log("Music Tags")
        response = await fetch("JSON/musicTags.json");
        musicTags = await response.json();
        console.log(musicTags);

        console.log("Music Vocals")
        response = await fetch("JSON/musicVocals.json");
        musicVocals = await response.json();
        console.log(musicVocals);
    }

    export function ProcessData() {
        processedSongs = [];
        musics.forEach(element => {
            let song = new Song(element.id, element.title, element.pronunciation, GetSongTag(element.id), GetAssetbundleName(element.id));
            processedSongs.push(song);
        });
        console.log("Processed Songs")
        console.log(processedSongs);
    }


    function GetSongTag(id: number): Unit {
        const filtered = musicTags.filter(({ musicId, musicTag }) => musicId == id && musicTag != "all");
        let uniqueItems = [...new Set(filtered)];
        if (uniqueItems.length == 1) {
            return uniqueItems[0].musicTag as Unit;
        }
        else {
            uniqueItems = uniqueItems.filter(({ musicTag }) => musicTag != 'vocaloid' && musicTag != 'other');
            if (uniqueItems.length == 0) {
                return Unit.other;
            }
            else if (uniqueItems.length == 1) {
                return uniqueItems[0].musicTag as Unit;
            }
            else {
                return Unit.all;
            }
        }
    }

    function GetAssetbundleName(id: number): string {
        //Example: https://pjsk.cleista.cc/api/asset/en/music/short/vs_0153_01/vs_0153_01_short.mp3

        const sekaiVocalInfo = musicVocals.find(({ musicId, musicVocalType }) => musicId == id && musicVocalType == "sekai");

        if (sekaiVocalInfo) {
            return sekaiVocalInfo.assetbundleName;
        } else {
            const otherVocalInfo = musicVocals.find(({ musicId }) => musicId == id);
            if (otherVocalInfo) {
                return otherVocalInfo.assetbundleName;
            } else {
                alert("error soz");
                return "ERROR: couldn't get vocal information";
            }
        }
    }

    export function MakeAndDownloadFile() {
        DownloadFile("songList.ts", MakeScriptText(processedSongs));
    }
    function MakeScriptText(songs: Song[]): string {
        let text = "const songs: Song[] = [\n"
        songs.forEach(item => {
            let line = `new Song(${item.id}, \`${item.displayName}\`, "${item.pronunciation}", "${item.unit}" as Unit, "${item.assetbundleName}"),\n`
            text += line;
        });
        text += "];"

        return text;
    }

    // Source - https://stackoverflow.com/a/18197341
    // Posted by Matěj Pokorný, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-11-13, License - CC BY-SA 3.0

    function DownloadFile(filename: string, text: string) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
}