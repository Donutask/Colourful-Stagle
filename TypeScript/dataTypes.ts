class Music {
    constructor(
        public id: number,
        public seq: number,
        public releaseConditionId: number,
        public categories: string[],
        public title: string,
        public pronunciation: string,
        public creatorArtistId: string,
        public lyricist: string,
        public composer: string,
        public arranger: string,
        public dancerCount: number,
        public selfDancerPosition: number,
        public assetbundleName: string,
        public liveTalkBackgroundAssetbundleName: string,
        public publishedAt: number,
        public releasedAt: number,
        public liveStageId: number,
        public fillerSec: number,
        public isNewlyWrittenMusic: boolean,
        public isFullLength: boolean
    ) { }
}

class MusicTag {
    constructor(
        public id: number,
        public musicId: number,
        public musicTag: string,
        public seq: number
    ) { }
}

class MusicVocalCharacter {
    constructor(
        public id: number,
        public musicId: number,
        public musicVocalId: number,
        public characterType: string,
        public characterId: number,
        public seq: number
    ) { }
}

class MusicVocal {
    constructor(
        public id: number,
        public musicId: number,
        public musicVocalType: string,
        public seq: number,
        public releaseConditionId: number,
        public caption: string,
        public characters: MusicVocalCharacter[],
        public assetbundleName: string,
        public archivePublishedAt: number
    ) { }
}