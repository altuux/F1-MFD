async function fetchDrivers() {
  try {
      const response = await fetch("https://api.openf1.org/v1/drivers?session_key=latest");
      const data = await response.json();

      if (!data || !Array.isArray(data)) {
          console.error("Invalid API response", data);
          return [];
      }

      return data.map(driver => ({
          driverNumber: driver.driver_number,
          nickname: driver.name_acronym,
          drs: driver.drs,
          teamName: driver.team_name
      }));
  } catch (error) {
      console.error("Error fetching driver data:", error);
      return [];
  }
}

async function fetchPositions() {
  try {
      const response = await fetch("https://api.openf1.org/v1/position?session_key=latest");
      const data = await response.json();

      if (!data || !Array.isArray(data)) {
          console.error("Invalid positions API response", data);
          return [];
      }

      return data;
  } catch (error) {
      console.error("Error fetching positions data:", error);
      return [];
  }
}

async function fetchIntervals() {
  try {
      const response = await fetch("https://api.openf1.org/v1/intervals?session_key=latest");
      const data = await response.json();

      if (!data || !Array.isArray(data)) {
          console.error("Invalid intervals API response", data);
          return [];
      }

      return data;
  } catch (error) {
      console.error("Error fetching intervals data:", error);
      return [];
  }
}

async function updateLeaderboard() {
  const drivers = await fetchDrivers();
  const positions = await fetchPositions();
  const intervals = await fetchIntervals();

  const positionMap = {};
  positions.forEach((item, index) => {
      positionMap[item.driver_number] = item.position || index + 1;
  });

  const intervalMap = {};
  intervals.forEach(item => {
      intervalMap[item.driver_number] = item.interval;
  });

  const combinedDrivers = drivers.map(driver => ({
      ...driver,
      position: positionMap[driver.driverNumber] || null,
      interval: intervalMap[driver.driverNumber] || null
  }));

  combinedDrivers.sort((a, b) => {
      if (a.position == null) return 1;
      if (b.position == null) return -1;
      return a.position - b.position;
  });

  const leaderboardBody = document.getElementById("leaderboard-body");
  leaderboardBody.innerHTML = "";

  const teamColors = {
    McLaren: "#ff8000",
    Mercedes: "#27f4d2",
    "Red Bull Racing": "#3671c6",
    Ferrari: "#e80020",
    Haas: "#b6babd",
    Williams: "#64c4ff",
    Alpine: "#64c4ff",
    "Aston Martin": "#229971",
    "Racing Bulls": "#6692ff",
    "Kick Sauber": "#52e252",
  };

  combinedDrivers.forEach(driver => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td><p class="nmb">${driver.position || "N/A"}</p></td>
          <td class="pos" style="background-color: ${teamColors[driver.teamName] || 'gray'};"><p class="nme"><div class="divnme" style="color: ${teamColors[driver.teamName] || 'gray'};">${driver.nickname || "N/A"}</div></p>${driver.driverNumber}</td>
          <td><div class="drs">${driver.drs || "PIT"}</div></td>
          <td>${driver.tire || "N/A"}</td>
          <td>${driver.info || "N/A"}</td>
          <td>${driver.position === 1 ? "----" : (`+${driver.interval || "N/A"}`)}</td>
          <td>${driver.teamName || "N/A"}</td>
      `;
      leaderboardBody.appendChild(row);
  });
}

updateLeaderboard();
setInterval(updateLeaderboard, 4000);