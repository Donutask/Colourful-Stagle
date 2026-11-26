// Not implemented
class SaveData {
    constructor(
        public currentRound: RoundData,
        // Character ID
        public chosenCharacter: number,
        public unitFilter: Unit[]
    ) { }
}

class RoundData {
    constructor(
        // List of song ids guessed this round
        public guesses: number[],
        // Correct song id (no cheating!)
        public songID: number,
        // False: daily mode
        public isUnlimited: boolean
    ) { };
}