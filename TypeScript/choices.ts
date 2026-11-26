namespace ChoicesManager {
    // Use Choices.js library to create a searchable list of all songs
    export const songChoicesElement = document.getElementById('choices') as HTMLSelectElement;


    //@ts-expect-error Importing with URL, don't have the .td files
    export let choices: Choices | undefined;
    let choiceList: object[];

    export function MakeChoices() {
        choiceList = [];
        songs.forEach(song => {
            choiceList.push({
                value: song.id,
                label: `<img class='unitIcon' src='Images/unit_icons/${song.unit}.svg'>` + song.displayName,
                customProperties: {
                    title: song.displayName,
                    unit: song.GetUnitDisplayName(),
                    unitId: song.unit,
                    pronunciation: song.pronunciation,
                    abbreviation: song.GetUnitAbbreviatedName(),
                },
            })
        });

        //@ts-expect-error
        choices = new Choices(songChoicesElement, {
            choices: choiceList,
            // The value is a number, don't search that.
            // Search the individual properties instead of the full thing to give more leeway. 
            // 'pronunciation' will let you search text without the special characters.
            searchFields: ['customProperties.pronunciation', 'customProperties.unit', 'customProperties.title', 'customProperties.abbreviation'],
            searchResultLimit: -1,
            searchPlaceholderValue: "Search for a song",
            placeholderValue: "No song selected",
            sorter: sortByLabel,
            shouldSort: true,
            allowHTML: true,
            position: "top"
        });

        songChoicesElement.addEventListener("change", () => {
            Game.guessButton.innerText = "Guess";
        })

        songChoicesElement.value = "";
    }

    // Used for unit hint and the song filter
    export function FilterChoicesToUnits(units: Unit[]) {
        if (choices == null) { return; }

        //@ts-expect-error Choice is any because no types defined
        let filteredChoices = choiceList.filter((c) => units.includes(c.customProperties.unitId));

        choices.clearChoices(true, true)
        choices.setChoices(filteredChoices);

        songChoicesElement.value = "";
    }

    export function ResetChoices() {
        if (choices == null) { return; }

        choices.clearChoices(true, true)
        choices.setChoices(choiceList);
        songChoicesElement.value = "";
    }

    // The sorting was assisted by Ai. I would I have made a real inefficient sorting algorithm otherwise.
    const sortByLabel = (a: any, b: any): number => {
        // Remove the image that's at the start
        const labelA = a.label.split(">")[1];
        const labelB = b.label.split(">")[1];

        // Start with A not ●
        const aLetter = startsWithLetter(labelA);
        const bLetter = startsWithLetter(labelB);

        if (aLetter !== bLetter) return aLetter ? -1 : 1;

        return labelA.localeCompare(labelB, undefined, {
            sensitivity: 'base',
            numeric: true,
            ignorePunctuation: true,
        });
    };

    const startsWithLetter = (str: string): boolean => /^\p{L}/u.test(str);
}