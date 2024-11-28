import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2023);  // Default year is 2023
  const [hoverData, setHoverData] = useState(null);  // For hover effect

  // Fetch data from the public folder
  useEffect(() => {
    fetch('/data.json')  // Correct path for public folder data
      .then((response) => response.json())
      .then((data) => {
        setHeatmapData(data);
      })
      .catch((error) => console.error('Error loading data:', error));
  }, []);

  // Filter data based on the selected year
  const filterDataByYear = (year) => {
    return heatmapData.filter((item) => {
      const itemYear = new Date(item.endTime).getFullYear();
      return itemYear === year;
    });
  };

  // Function to generate the calendar and heatmap
  const generateCalendar = () => {
    const filteredData = filterDataByYear(selectedYear);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Create a month-to-day heatmap
    return months.map((month, monthIndex) => {
      const daysInMonth = new Date(selectedYear, monthIndex + 1, 0).getDate(); // Calculate days in month
      const dayData = Array(daysInMonth).fill(0);

      filteredData.forEach((item) => {
        const itemDate = new Date(item.endTime);
        if (itemDate.getMonth() === monthIndex && itemDate.getFullYear() === selectedYear) {
          dayData[itemDate.getDate() - 1] += Math.floor(item.msPlayed / 1000); // Sum up played seconds per day
        }
      });

      return (
        <div className="month" key={monthIndex}>
          <h3>{month}</h3>
          <div className="calendar">
            {Array.from({ length: daysInMonth }, (_, day) => {
              const heat = dayData[day] || 0;  // Get heat for each day (default to 0 if no data)

              // Generate a color scale based on heat
              const heatColor = `rgb(255, ${255 - heat * 0.1}, ${255 - heat * 0.2})`;

              return (
                <div
                  key={day}
                  className="day"
                  style={{ backgroundColor: heat > 0 ? heatColor : 'transparent' }}
                  data-heat={heat}
                  onClick={() => alert(`${month} ${day + 1} - ${heat} seconds played`)}
                  onMouseEnter={() => setHoverData(`${month} ${day + 1}: ${heat} seconds`)}
                  onMouseLeave={() => setHoverData(null)}
                >
                  {day + 1}
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="App">
      <h1>{selectedYear} Spotify Heatmap Calendar</h1>

      {/* Year selector buttons */}
      <div className="year-selector">
        <button onClick={() => setSelectedYear(2022)}>2022</button>
        <button onClick={() => setSelectedYear(2023)}>2023</button>
        <button onClick={() => setSelectedYear(2024)}>2024</button>
      </div>

      {/* Hover effect for additional data */}
      {hoverData && <div className="hover-info">{hoverData}</div>}

      <div className="calendar-container">
        {generateCalendar()}
      </div>
    </div>
  );
};

export default App;
