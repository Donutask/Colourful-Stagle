"use strict";
const songChoicesElement = document.getElementById('choices');
let choices;
function MakeChoices() {
    let choiceList = [];
    songs.forEach(song => {
        choiceList.push({
            value: song.id,
            label: `<img class='unitIcon' src='Images/unit_icons/${song.unit}.svg'>` + song.displayName,
            customProperties: {
                title: song.displayName,
                unit: song.GetUnitDisplayName(),
                pronunciation: song.pronunciation
            },
        });
    });
    choices = new Choices(songChoicesElement, {
        choices: choiceList,
        searchFields: ['customProperties.pronunciation', 'customProperties.unit', 'customProperties.title'],
        searchResultLimit: -1,
        searchPlaceholderValue: "Search for a song",
        placeholderValue: "No song selected",
        sorter: sortByLabel,
        shouldSort: true,
        allowHTML: true,
        position: "top"
    });
    songChoicesElement.addEventListener("change", () => {
        guessButton.innerText = "Guess";
    });
}
const sortByLabel = (a, b) => {
    const labelA = a.label.split(">")[1];
    const labelB = b.label.split(">")[1];
    const aLetter = startsWithLetter(labelA);
    const bLetter = startsWithLetter(labelB);
    if (aLetter !== bLetter)
        return aLetter ? -1 : 1;
    return labelA.localeCompare(labelB, undefined, {
        sensitivity: 'base',
        numeric: true,
        ignorePunctuation: true,
    });
};
const startsWithLetter = (str) => /^\p{L}/u.test(str);
