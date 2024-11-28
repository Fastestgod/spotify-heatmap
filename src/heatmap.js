import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        const playtimeByDate = {};

        data.forEach(entry => {
          const date = entry.endTime.split(" ")[0];
          if (!playtimeByDate[date]) {
            playtimeByDate[date] = 0;
          }
          playtimeByDate[date] += entry.msPlayed;
        });

        const processedData = Object.entries(playtimeByDate).map(([date, msPlayed]) => ({
          date,
          minutes: (msPlayed / 60000).toFixed(2),
        }));

        setHeatmapData(processedData);
      })
      .catch(error => console.error('Error fetching the data:', error));
  }, []);

  const chartData = {
    labels: heatmapData.map(item => item.date),
    datasets: [{
      label: 'Minutes Listened',
      data: heatmapData.map(item => item.minutes),
      backgroundColor: heatmapData.map(item => `rgba(255, ${Math.max(255 - item.minutes * 5, 100)}, 100, 0.8)`),
    }],
  };

  return (
    <div className="App">
      <h1>Music Listening Heatmap</h1>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Date',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Minutes Played',
              },
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
}

export default App;
