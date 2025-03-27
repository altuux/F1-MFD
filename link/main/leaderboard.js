async function fetchData() {
    try {
      const response = await fetch("https://api.openf1.org/api/f1/current/last/results");
      const data = await response.json();
  
      if (!data || !data.MRData || !data.MRData.RaceTable || !data.MRData.RaceTable.Races || !data.MRData.RaceTable.Races[0].Results) {
        console.error("Invalid API response", data);
        return [];
      }
  
      return data.MRData.RaceTable.Races[0].Results.map((result) => ({
        position: result.position,
        driver: result.Driver.familyName, // Adjusted to the actual property path
        lapTime: result.Time ? result.Time.time : "N/A", // Handles lapTime differently
      }));
    } catch (error) {
      console.error("Error fetching race data:", error);
      return [];
    }
}

function Leaderboard() {
    const [drivers, setDrivers] = React.useState([]);
  
    React.useEffect(() => {
      async function updateData() {
        const newDrivers = await fetchData();
        setDrivers(newDrivers);
      }
  
      updateData();
      const interval = setInterval(updateData, 5000);
      return () => clearInterval(interval);
    }, []);
  
    return (
      <table className="leaderboard">
        <thead>
          <tr>
            <th>Position</th>
            <th>Driver</th>
            <th>Lap Time</th>
          </tr>
        </thead>
        <tbody>
          {drivers.length > 0 ? (
            drivers.map((driver, index) => (
              <tr key={index}>
                <td>{driver.position}</td>
                <td>{driver.driver}</td>
                <td>{driver.lapTime}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    );
}
  
ReactDOM.createRoot(document.getElementById("root")).render(<Leaderboard />);
