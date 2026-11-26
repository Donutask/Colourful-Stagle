"use strict";
var SongFilter;
(function (SongFilter) {
    const unitFilterDialogue = document.getElementById("unitFilterDialogue");
    const unitFilterToggleAll = document.getElementById("unitFilterToggleAll");
    SongFilter.unitFilters = [];
    let toggleAllState;
    function HasFilter() { return SongFilter.unitFilters != null && SongFilter.unitFilters.length > 0; }
    SongFilter.HasFilter = HasFilter;
    ;
    function GetFilteredSongs() {
        return songs.filter(({ unit }) => SongFilter.unitFilters.includes(unit));
    }
    SongFilter.GetFilteredSongs = GetFilteredSongs;
    function OpenSongFilter() {
        toggleAllState = SongFilter.unitFilters.length > 0;
        unitFilterToggleAll.checked = !toggleAllState;
        const checkboxes = document.getElementsByName('unitFilter');
        checkboxes.forEach(checkbox => {
            const element = checkbox;
            if (SongFilter.unitFilters == null || SongFilter.unitFilters.length <= 0 || SongFilter.unitFilters.includes(element.value)) {
                element.checked = true;
            }
            else {
                element.checked = false;
            }
        });
        unitFilterDialogue.showModal();
    }
    SongFilter.OpenSongFilter = OpenSongFilter;
    function CloseSongFilter() {
        const checkboxes = document.getElementsByName('unitFilter');
        SongFilter.unitFilters = [];
        let checkedCount = 0;
        checkboxes.forEach(checkbox => {
            const element = checkbox;
            if (element.checked) {
                SongFilter.unitFilters.push(element.value);
                checkedCount++;
            }
        });
        if (checkedCount <= 0) {
            alert("Please select at least one unit.");
            return;
        }
        if (SongFilter.unitFilters.length > 0) {
            if (SongFilter.unitFilters.length == 1 && SongFilter.unitFilters[0] == Unit.other) {
            }
            else {
                SongFilter.unitFilters.push(Unit.all);
            }
            if (SongFilter.unitFilters.length >= 8) {
                SongFilter.unitFilters = [];
            }
        }
        localStorage.setItem(Game.unitFilterKey, JSON.stringify(SongFilter.unitFilters));
        unitFilterDialogue.close();
    }
    SongFilter.CloseSongFilter = CloseSongFilter;
    function SongFilterToggleAll() {
        const checkboxes = document.getElementsByName('unitFilter');
        checkboxes.forEach(checkbox => {
            const element = checkbox;
            element.checked = toggleAllState;
        });
        toggleAllState = !toggleAllState;
    }
    SongFilter.SongFilterToggleAll = SongFilterToggleAll;
})(SongFilter || (SongFilter = {}));
