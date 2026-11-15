"use strict";
class Music {
    constructor(id, seq, releaseConditionId, categories, title, pronunciation, creatorArtistId, lyricist, composer, arranger, dancerCount, selfDancerPosition, assetbundleName, liveTalkBackgroundAssetbundleName, publishedAt, releasedAt, liveStageId, fillerSec, isNewlyWrittenMusic, isFullLength) {
        this.id = id;
        this.seq = seq;
        this.releaseConditionId = releaseConditionId;
        this.categories = categories;
        this.title = title;
        this.pronunciation = pronunciation;
        this.creatorArtistId = creatorArtistId;
        this.lyricist = lyricist;
        this.composer = composer;
        this.arranger = arranger;
        this.dancerCount = dancerCount;
        this.selfDancerPosition = selfDancerPosition;
        this.assetbundleName = assetbundleName;
        this.liveTalkBackgroundAssetbundleName = liveTalkBackgroundAssetbundleName;
        this.publishedAt = publishedAt;
        this.releasedAt = releasedAt;
        this.liveStageId = liveStageId;
        this.fillerSec = fillerSec;
        this.isNewlyWrittenMusic = isNewlyWrittenMusic;
        this.isFullLength = isFullLength;
    }
}
class MusicTag {
    constructor(id, musicId, musicTag, seq) {
        this.id = id;
        this.musicId = musicId;
        this.musicTag = musicTag;
        this.seq = seq;
    }
}
class MusicVocalCharacter {
    constructor(id, musicId, musicVocalId, characterType, characterId, seq) {
        this.id = id;
        this.musicId = musicId;
        this.musicVocalId = musicVocalId;
        this.characterType = characterType;
        this.characterId = characterId;
        this.seq = seq;
    }
}
class MusicVocal {
    constructor(id, musicId, musicVocalType, seq, releaseConditionId, caption, characters, assetbundleName, archivePublishedAt) {
        this.id = id;
        this.musicId = musicId;
        this.musicVocalType = musicVocalType;
        this.seq = seq;
        this.releaseConditionId = releaseConditionId;
        this.caption = caption;
        this.characters = characters;
        this.assetbundleName = assetbundleName;
        this.archivePublishedAt = archivePublishedAt;
    }
}
