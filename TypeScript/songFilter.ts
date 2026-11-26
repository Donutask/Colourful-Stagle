namespace SongFilter {
    const unitFilterDialogue = document.getElementById("unitFilterDialogue") as HTMLDialogElement;
    const unitFilterToggleAll = document.getElementById("unitFilterToggleAll") as HTMLInputElement;

    export let unitFilters: Unit[] = [];

    let toggleAllState: boolean;

    export function HasFilter(): boolean { return unitFilters != null && unitFilters.length > 0 };

    // Only songs from specific unit
    export function GetFilteredSongs(): Song[] {
        return songs.filter(({ unit }) => unitFilters.includes(unit));
    }

    export function OpenSongFilter() {
        toggleAllState = unitFilters.length > 0;
        unitFilterToggleAll.checked = !toggleAllState;

        const checkboxes = document.getElementsByName('unitFilter');

        checkboxes.forEach(checkbox => {
            const element = checkbox as HTMLInputElement;
            if (unitFilters == null || unitFilters.length <= 0 || unitFilters.includes(element.value as Unit)) {
                element.checked = true;
            } else {
                element.checked = false;
            }
        });
        unitFilterDialogue.showModal();
    }

    export function CloseSongFilter() {
        const checkboxes = document.getElementsByName('unitFilter');

        unitFilters = [];
        let checkedCount = 0;
        checkboxes.forEach(checkbox => {
            const element = checkbox as HTMLInputElement;
            if (element.checked) {
                unitFilters.push(element.value as Unit);
                checkedCount++;
            }
        });

        if (checkedCount <= 0) {
            alert("Please select at least one unit.");
            return;
        }

        if (unitFilters.length > 0) {
            if (unitFilters.length == 1 && unitFilters[0] == Unit.other) {
                // Exclude mixed songs from those not by the main groups
            } else {
                unitFilters.push(Unit.all);
            }

            // All filters on, so not actually filtering
            if (unitFilters.length >= 8) {
                unitFilters = [];
            }
        }

        localStorage.setItem(Game.unitFilterKey, JSON.stringify(unitFilters));

        unitFilterDialogue.close();
    }
    export function SongFilterToggleAll() {
        const checkboxes = document.getElementsByName('unitFilter');

        checkboxes.forEach(checkbox => {
            const element = checkbox as HTMLInputElement;
            element.checked = toggleAllState;
        });

        toggleAllState = !toggleAllState;
    }
}