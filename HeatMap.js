const fs = require('fs');

// Read JSON file
fs.readFile('history.json', 'utf8', (err, jsonData) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Parse JSON
  const data = JSON.parse(jsonData);
  const playtimeByDate = {};

  data.forEach(entry => {
    const date = entry.endTime.split(" ")[0];
    if (!playtimeByDate[date]) {
      playtimeByDate[date] = 0;
    }
    playtimeByDate[date] += entry.msPlayed;
  });

  // Convert ms to minutes
  const heatmapData = Object.entries(playtimeByDate).map(([date, msPlayed]) => ({
    date,
    minutes: (msPlayed / 60000).toFixed(2)
  }));

  console.log("Date-wise Listening Time (Minutes):", heatmapData);
});
