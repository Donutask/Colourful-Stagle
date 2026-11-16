// Use Choices.js library to create a searchable list of all songs
const songChoicesElement = document.getElementById('choices') as HTMLSelectElement;

//@ts-expect-error
let choices: Choices | undefined;

function MakeChoices() {
    let choiceList: object[] = [];
    songs.forEach(song => {
        choiceList.push({
            value: song.id,
            label: `<img class='unitIcon' src='Images/unit_icons/${song.unit}.svg'>` + song.displayName,
            customProperties: {
                title: song.displayName,
                unit: song.GetUnitDisplayName(),
                pronunciation: song.pronunciation
            },
        })
    });

    // Importing with URL, don't have the td files
    //@ts-expect-error
    choices = new Choices(songChoicesElement, {
        choices: choiceList,
        // The value is a number, don't search that.
        // Search the individual properties instead of the full thing to give more leeway. 
        // 'pronunciation' will let you search text without the special characters.
        searchFields: ['customProperties.pronunciation', 'customProperties.unit', 'customProperties.title'],
        searchResultLimit: -1,
        searchPlaceholderValue: "Search for a song",
        placeholderValue: "No song selected",
        sorter: sortByLabel,
        shouldSort: true,
        // More lenient search
        // fuseOptions: {
        //     threshold: 0.75,
        //     ignoreLocation: true,
        //     includeScore: true
        // },
        allowHTML: true,
        position: "top"
    });

    songChoicesElement.addEventListener("change", () => {
        guessButton.innerText = "Guess";
    })
}

const sortByLabel = (a: any, b: any) => {
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