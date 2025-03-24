document.addEventListener("DOMContentLoaded", async () => {
    const seasonSelect = document.getElementById("season-select");
    const raceContainer = document.getElementById("race-container");

    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1950; year--) {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        seasonSelect.appendChild(option);
    }

    async function loadRaces(season) {
        raceContainer.innerHTML = "<p>Loading races...</p>";
        
        try {
            const response = await fetch(`https://api.jolpi.ca/ergast/f1/${season}.json`);
            const data = await response.json();
            const races = data.MRData.RaceTable.Races;

            raceContainer.innerHTML = "";

            if (races.length === 0) {
                raceContainer.innerHTML = "<p>No races found for this season.</p>";
                return;
            }

            races.reverse().forEach((race) => {
                const box = document.createElement("div");
                box.classList.add("race-box");

                box.innerHTML = `
                    <strong>${race.raceName}</strong><br>
                    ${race.Circuit.circuitName}<br>
                    ${race.date}
                `;

                raceContainer.appendChild(box);
            });
        } catch (error) {
            console.error("Error fetching F1 races:", error);
            raceContainer.innerHTML = "<p>Error loading race data. Please try again later.</p>";
        }
    }

    loadRaces(currentYear);

    seasonSelect.addEventListener("change", (event) => {
        loadRaces(event.target.value);
    });
});
