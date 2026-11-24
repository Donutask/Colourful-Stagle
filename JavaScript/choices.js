"use strict";
var ChoicesManager;
(function (ChoicesManager) {
    ChoicesManager.songChoicesElement = document.getElementById('choices');
    let choiceList;
    function MakeChoices() {
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
            });
        });
        ChoicesManager.choices = new Choices(ChoicesManager.songChoicesElement, {
            choices: choiceList,
            searchFields: ['customProperties.pronunciation', 'customProperties.unit', 'customProperties.title', 'customProperties.abbreviation'],
            searchResultLimit: -1,
            searchPlaceholderValue: "Search for a song",
            placeholderValue: "No song selected",
            sorter: sortByLabel,
            shouldSort: true,
            allowHTML: true,
            position: "top"
        });
        ChoicesManager.songChoicesElement.addEventListener("change", () => {
            Game.guessButton.innerText = "Guess";
        });
        ChoicesManager.songChoicesElement.value = "";
    }
    ChoicesManager.MakeChoices = MakeChoices;
    function FilterChoicesToUnit(unit) {
        let filteredChoices = choiceList.filter((c) => c.customProperties.unitId == unit);
        ChoicesManager.choices.clearChoices(true, true);
        ChoicesManager.choices.setChoices(filteredChoices);
    }
    ChoicesManager.FilterChoicesToUnit = FilterChoicesToUnit;
    function ResetChoices() {
        if (ChoicesManager.choices != null) {
            ChoicesManager.choices.clearChoices(true, true);
            ChoicesManager.choices.setChoices(choiceList);
            ChoicesManager.songChoicesElement.value = "";
        }
    }
    ChoicesManager.ResetChoices = ResetChoices;
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
})(ChoicesManager || (ChoicesManager = {}));
