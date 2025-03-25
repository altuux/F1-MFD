document.addEventListener("DOMContentLoaded", async () => {
    const seasonSelect = document.getElementById("season-select");
    const raceContainer = document.getElementById("race-container");

    const currentYear = new Date().getFullYear();
    const today = new Date();

    for (let year = currentYear; year >= 1950; year--) {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        seasonSelect.appendChild(option);
    }

    async function loadRaces(season) {
        raceContainer.innerHTML = "<p>Načítání závodů...</p>";

        try {
            const response = await fetch(`https://api.jolpi.ca/ergast/f1/${season}.json`);
            const data = await response.json();
            const races = data.MRData.RaceTable.Races;

            raceContainer.innerHTML = "";

            if (races.length === 0) {
                raceContainer.innerHTML = "<p>Žádné závody nebyly pro tuto sezónu nalezeny...</p>";
                return;
            }

            races.reverse().forEach((race) => {
                const raceDate = new Date(race.date);

                if (season == currentYear && raceDate > today) {
                    return;
                }

                const box = document.createElement("div");
                box.classList.add("race-box");

                box.innerHTML = `
                    <strong>
                    <a href="race.html?season=${season}&round=${race.round}" 
                    style="text-decoration: none; color: white;">
                    ${race.raceName}</strong><br>
                    ${race.Circuit.circuitName}<br>
                    ${race.date}</a>
                `;

                raceContainer.appendChild(box);
            });
        } catch (error) {
            console.error("Error fetching F1 races:", error);
            raceContainer.innerHTML = "<p>Chyba při načítání. Prosím zkuste znovu.</p>";
        }
    }

    loadRaces(currentYear);

    seasonSelect.addEventListener("change", (event) => {
        loadRaces(event.target.value);
    });
});
