const fs = require('fs');

// Function to sort data by year, month, day, artist name, track name, and msPlayed
const sortData = (data) => {
  const groupedData = {};

  data.forEach((entry) => {
    const date = new Date(entry.endTime);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // months are zero-indexed
    const day = date.getDate();

    if (!groupedData[year]) {
      groupedData[year] = {};
    }
    if (!groupedData[year][month]) {
      groupedData[year][month] = {};
    }
    if (!groupedData[year][month][day]) {
      groupedData[year][month][day] = [];
    }

    // Add track info (without endTime) to the corresponding day
    groupedData[year][month][day].push({
      artistName: entry.artistName,
      trackName: entry.trackName,
      msPlayed: entry.msPlayed,
    });
  });

  // Sort the data by artistName, trackName, and msPlayed
  Object.keys(groupedData).forEach((year) => {
    Object.keys(groupedData[year]).forEach((month) => {
      Object.keys(groupedData[year][month]).forEach((day) => {
        groupedData[year][month][day].sort((a, b) => {
          if (a.artistName < b.artistName) return -1;
          if (a.artistName > b.artistName) return 1;
          if (a.trackName < b.trackName) return -1;
          if (a.trackName > b.trackName) return 1;
          return a.msPlayed - b.msPlayed;
        });
      });
    });
  });

  return groupedData;
};

// Read the data from the JSON file
fs.readFile('public/data.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Parse the JSON data, handling any potential syntax errors
  let parsedData;
  try {
    parsedData = JSON.parse(data);
  } catch (err) {
    console.error('Error parsing JSON:', err);
    return;
  }

  // Check if parsedData is an array (should be in array format as per your example)
  if (!Array.isArray(parsedData)) {
    console.error('Expected JSON data to be an array');
    return;
  }

  // Sort and group the data
  const groupedData = sortData(parsedData);

  // Output the sorted and grouped data to the console
  console.log(JSON.stringify(groupedData, null, 2));

  // Optionally, save the sorted and grouped data back to a new file
  fs.writeFile('grouped_data.json', JSON.stringify(groupedData, null, 2), (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('Data sorted and grouped by year, month, and day, saved to grouped_data.json');
    }
  });
});
