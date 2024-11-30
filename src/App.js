import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Function to process data and calculate total msPlayed and the most played track for each day
const processData = (data) => {
  const heatmapData = {};

  for (const year in data) {
    for (const month in data[year]) {
      for (const day in data[year][month]) {
        const dayData = data[year][month][day];

        // Create a map to aggregate playtime for each track
        const trackPlayTimeMap = {};

        dayData.forEach((track) => {
          if (trackPlayTimeMap[track.trackName]) {
            trackPlayTimeMap[track.trackName] += track.msPlayed;
          } else {
            trackPlayTimeMap[track.trackName] = track.msPlayed;
          }
        });

        // Calculate total msPlayed for the day
        const totalMsPlayed = Object.values(trackPlayTimeMap).reduce((acc, time) => acc + time, 0);

        // Find the most played track for the day by combined playtime
        const mostPlayedTrack = Object.entries(trackPlayTimeMap).reduce(
          (maxTrack, [trackName, msPlayed]) =>
            msPlayed > maxTrack.msPlayed ? { trackName, msPlayed } : maxTrack,
          { trackName: 'No Data', msPlayed: 0 }
        );

        heatmapData[`${year}-${month}-${day}`] = {
          totalMsPlayed,
          mostPlayedTrack: mostPlayedTrack.trackName,
          mostPlayedMs: mostPlayedTrack.msPlayed,
        };
      }
    }
  }

  return heatmapData;
};

// Function to fetch data from the server using axios
const fetchData = async () => {
  try {
    const response = await axios.get('/data.json'); // Path to your JSON data file
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

// Utility function to get the number of days in a month
const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();

const App = () => {
  const [heatmapData, setHeatmapData] = useState({});
  const [hoverData, setHoverData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [dataYear, setDataYear] = useState('2023');

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchData();
      if (data) {
        const processedData = processData(data);
        setHeatmapData(processedData);
      }
    };
    loadData();
  }, []);

  const generateCalendar = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    return months.map((month, monthIndex) => {
      const daysInMonth = getDaysInMonth(monthIndex + 1, parseInt(dataYear));

      return (
        <div className="month" key={monthIndex}>
          <h3>{month} {dataYear}</h3>
          <div className="calendar">
            {Array.from({ length: daysInMonth }, (_, dayIndex) => {
              const day = dayIndex + 1;
              const dayString = `${dataYear}-${monthIndex + 1}-${day}`;

              const dayData = heatmapData[dayString] || {};
              const minutes = ((dayData.totalMsPlayed || 0) / 60000).toFixed(1);
              const heat = Math.ceil(minutes / 20);

              return (
                <div
                  key={day}
                  className="day"
                  data-heat={heat}
                  onMouseEnter={(e) => {
                    setTooltipPosition({ x: e.clientX, y: e.clientY });
                    setHoverData({
                      date: `${month} ${day}, ${dataYear}`,
                      time: minutes,
                      mostPlayed: dayData.mostPlayedTrack || 'N/A',
                      mostPlayedTime: ((dayData.mostPlayedMs || 0) / 60000).toFixed(1),
                    });
                  }}
                  onMouseLeave={() => setHoverData(null)}
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

      <div className="year-selection">
        <button onClick={() => setDataYear('2023')}>2023</button>
        <button onClick={() => setDataYear('2024')}>2024</button>
      </div>

      <div className="calendar-container">
        {generateCalendar()}
      </div>

      {hoverData && (
        <div
          className="tooltip"
          style={{
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y + 10}px`,
          }}
        >
          <p><strong>{hoverData.date}</strong></p>
          <p>{hoverData.time} minutes played</p>
          <p>Most played: <strong>{hoverData.mostPlayed}</strong></p>
          <p>Time: {hoverData.mostPlayedTime} minutes</p>
        </div>
      )}
    </div>
  );
};

export default App;
