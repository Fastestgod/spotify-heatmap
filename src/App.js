import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Function to process data and calculate the total msPlayed for each day
const processData = (data) => {
  const heatmapData = {};

  // Loop through years, months, and days in the data
  for (const year in data) {
    for (const month in data[year]) {
      for (const day in data[year][month]) {
        const dayData = data[year][month][day];

        // Calculate total msPlayed for the day
        const totalMsPlayed = dayData.reduce((acc, track) => acc + track.msPlayed, 0);
        
        // Store the total msPlayed for that day
        heatmapData[`${year}-${month}-${day}`] = totalMsPlayed;
      }
    }
  }

  return heatmapData;
};

// Function to fetch data from the server using axios
const fetchData = async () => {
  try {
    const response = await axios.get('/data.json'); // Path to your JSON data file
    return response.data; // Return the data directly from the response
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

// Utility function to get the number of days in a month
const getDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

const App = () => {
  const [heatmapData, setHeatmapData] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [hoverData, setHoverData] = useState(null); // Store hover data for tooltips
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 }); // Track tooltip position
  const [dataYear, setDataYear] = useState('2023'); // Set default year (2023)
  
  // Fetch and process the data on initial load
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchData();
      if (data) {
        const processedData = processData(data); // Process the data to get heatmap data
        setHeatmapData(processedData);
      }
    };
    loadData();
  }, []);

  // Function to generate calendar days with heatmap data
  const generateCalendar = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return months.map((month, monthIndex) => {
      const daysInMonth = getDaysInMonth(monthIndex + 1, parseInt(dataYear)); // Get days in current month

      return (
        <div className="month" key={monthIndex}>
          <h3>{month} {dataYear}</h3> {/* Include the year in the header */}
          <div className="calendar">
            {/* Generate all days for the month */}
            {Array.from({ length: daysInMonth }, (_, dayIndex) => {
              const day = dayIndex + 1;
              const dayString = `${dataYear}-${monthIndex + 1}-${day}`;
              
              const minutes = (( heatmapData[dayString] || 0) / 60000).toFixed(1); // Convert msPlayed to minutes for display (divide by 60000)
              const heat = Math.ceil(minutes)/20; // Get heat (msPlayed total) for the day (default to 0)
              return (
                <div
                  key={day}
                  className="day"
                  data-heat={Math.round(minutes/30)}
                  onClick={() => setSelectedDate(dayString)}
                  onMouseEnter={(e) => {
                    setTooltipPosition({ x: e.clientX, y: e.clientY });
                    setHoverData({ date: `${month} ${day}, ${dataYear}`, time: minutes });
                  }}
                  onMouseLeave={() => setHoverData(null)} // Remove tooltip on mouse leave
                >
                  {day}
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
      <h1>Heatmap Calendar</h1>
      
      {/* Year Selection */}
      <div className="year-selection">
        <button onClick={() => setDataYear('2023')}>2023</button>
        <button onClick={() => setDataYear('2024')}>2024</button>
      </div>
      
      <div className="calendar-container">
        {generateCalendar()}
      </div>

      {/* Tooltip for hover effect */}
      {hoverData && (
        <div
          className="tooltip"
          style={{
            left: `${tooltipPosition.x + 10}px`, // Slight offset from cursor
            top: `${tooltipPosition.y + 10}px`,  // Slight offset from cursor
          }}
        >
          <p><strong>{hoverData.date}</strong></p>
          <p>{hoverData.time} minutes</p>
        </div>
      )}
    </div>
  );
};

export default App;
