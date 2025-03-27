async function fetchDrivers() {
    try {
      const response = await fetch("https://api.openf1.org/v1/drivers?session_key=latest");
      const data = await response.json();
  
      if (!data || !Array.isArray(data)) {
        console.error("Invalid API response", data);
        return [];
      }
  
      return data.map(driver => ({
        position: driver.position,
        nickname: driver.name_acronym,
        driverNumber: driver.driver_number,
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
  
  function Leaderboard() {
    const [drivers, setDrivers] = React.useState([]);
    const [positions, setPositions] = React.useState([]);
    const [intervals, setIntervals] = React.useState([]);
  
    React.useEffect(() => {
      async function updateDrivers() {
        const newDrivers = await fetchDrivers();
        setDrivers(newDrivers);
      }
      updateDrivers();
      const driverInterval = setInterval(updateDrivers, 20000000);
      return () => clearInterval(driverInterval);
    }, []);
  
    React.useEffect(() => {
      async function updatePositions() {
        const newPositions = await fetchPositions();
        setPositions(newPositions);
      }
      updatePositions();
      const positionsInterval = setInterval(updatePositions, 4000);
      return () => clearInterval(positionsInterval);
    }, []);
  
    React.useEffect(() => {
      async function updateIntervals() {
        const newIntervals = await fetchIntervals();
        setIntervals(newIntervals);
      }
      updateIntervals();
      const intervalsInterval = setInterval(updateIntervals, 4000);
      return () => clearInterval(intervalsInterval);
    }, []);
  
    // Create a mapping for positions based on driver_number.
    const positionMap = React.useMemo(() => {
      const map = {};
      positions.forEach((item, index) => {
        // Use the provided position field if available; otherwise, default to index+1.
        map[item.driver_number] = item.position || index + 1;
      });
      return map;
    }, [positions]);
  
    // Create a mapping for intervals based on driver_number.
    const intervalMap = React.useMemo(() => {
      const map = {};
      intervals.forEach(item => {
        map[item.driver_number] = item.interval; // or item.gap_to_leader if preferred
      });
      return map;
    }, [intervals]);
  
    // Combine driver info with position and interval details.
    const combinedDrivers = React.useMemo(() => {
      return drivers.map(driver => ({
        ...driver,
        position: positionMap[driver.driverNumber] || null,
        interval: intervalMap[driver.driverNumber] || null
      }));
    }, [drivers, positionMap, intervalMap]);
  
    // Sort drivers based on their position.
    const sortedDrivers = React.useMemo(() => {
      return [...combinedDrivers].sort((a, b) => {
        if (a.position == null) return 1;
        if (b.position == null) return -1;
        return a.position - b.position;
      });
    }, [combinedDrivers]);
    
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

    return (
      <div className="table-wrapper">
        <table className="leaderboard">
          <thead>
            <tr>
              <th>Pozice</th>
              <th>DRS</th>
              <th>Stáj</th>
              <th>Interval</th>
            </tr>
          </thead>
          <tbody>
            {sortedDrivers.length > 0 ? (
                sortedDrivers.map(driver => (
                <tr key={driver.driverNumber}>
                    <td
                    className="pos" style={{ backgroundColor: teamColors[driver.teamName] || "gray" }}>
                    {driver.nickname ? `${driver.position} ${driver.nickname} ${driver.driverNumber} ` : `N/A (${driver.driverNumber})`}
                    </td>
                    <td>{driver.drs}</td>
                    <td>{driver.teamName}</td>
                    <td>+{driver.interval != null ? driver.interval : "N/A"}</td>
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan="4">Žádná data</td>
                </tr>
            )}
        </tbody>
        </table>
      </div>
    );
  }
  
  ReactDOM.createRoot(document.getElementById("root")).render(<Leaderboard />);
  