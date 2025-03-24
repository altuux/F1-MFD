document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const season = params.get("season");
    const round = params.get("round");

    if (!season || !round) {
        document.body.innerHTML = "<h1>Neplatný závod</h1>";
        return;
    }

    async function loadRaceDetails() {
        try {
            const response = await fetch(`https://api.jolpi.ca/ergast/f1/${season}/${round}/results.json`);
            const data = await response.json();
            const race = data.MRData.RaceTable.Races[0];

            document.getElementById("race-title").textContent = race.raceName;
            document.getElementById("circuit-name").textContent = race.Circuit.circuitName;
            document.getElementById("race-date").textContent = race.date;

            const resultsTable = document.querySelector("#race-results tbody");
            race.Results.forEach(result => {
                resultsTable.innerHTML += `
                    <tr>
                        <td>${result.position}</td>
                        <td>${result.Driver.familyName}</td>
                        <td>${result.Constructor.name}</td>
                        <td>${result.laps}</td>
                        <td>${result.Time ? result.Time.time : "Retired"}</td>
                        <td>${result.points}</td>
                    </tr>
                `;
            });

            // Fetch qualifying results
            const qualifyingResponse = await fetch(`https://ergast.com/api/f1/${season}/${round}/qualifying.json`);
            const qualifyingData = await qualifyingResponse.json();
            const qualifyingResults = qualifyingData.MRData.RaceTable.Races[0].QualifyingResults;
            const qualifyingTable = document.querySelector("#qualifying tbody");
            
            qualifyingResults.forEach(q => {
                qualifyingTable.innerHTML += `
                    <tr>
                        <td>${q.position}</td>
                        <td>${q.Driver.familyName}</td>
                        <td>${q.Q1 || "-"}</td>
                        <td>${q.Q2 || "-"}</td>
                        <td>${q.Q3 || "-"}</td>
                    </tr>
                `;
            });

        } catch (error) {
            console.error("Error loading race details:", error);
            document.body.innerHTML = "<h1>Chyba při načítání závodu</h1>";
        }
    }

    loadRaceDetails();
});
