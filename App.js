document.addEventListener('DOMContentLoaded', function () {
  // Simulated data: songs listened to per month (12 months for a year)
  const songData = {
      2022: generateYearlyData(),
      2023: generateYearlyData(),
      2024: generateYearlyDataUntilToday(),
  };

  // Render heatmap for a given year
  function renderHeatmap(year) {
      const heatmapContainer = document.getElementById('heatmap-container');
      heatmapContainer.innerHTML = ''; // Clear previous heatmap

      const months = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const data = songData[year];

      months.forEach((month, index) => {
          const monthBox = document.createElement('div');
          monthBox.classList.add('heatmap-box');
          const songCount = data[index];
          monthBox.style.backgroundColor = getColorForCount(songCount);
          monthBox.setAttribute('data-tooltip', `${month}: ${songCount} songs`);

          // Add the number of songs inside the box
          const songCountText = document.createElement('span');
          songCountText.classList.add('song-count');
          songCountText.innerText = songCount;
          monthBox.appendChild(songCountText);

          // Display tooltip on hover
          monthBox.addEventListener('mouseenter', function () {
              showTooltip(this.getAttribute('data-tooltip'), monthBox);
          });
          monthBox.addEventListener('mouseleave', hideTooltip);

          heatmapContainer.appendChild(monthBox);
      });
  }

  // Simulate data for each month
  function generateYearlyData() {
      return Array.from({ length: 12 }, () => Math.floor(Math.random() * 100));
  }

  // Simulate current year data until the current month
  function generateYearlyDataUntilToday() {
      const now = new Date();
      return Array.from({ length: now.getMonth() + 1 }, () => Math.floor(Math.random() * 100));
  }

  // Determine the background color based on the count
  function getColorForCount(count) {
      if (count === 0) return '#d3d3d3'; // light gray for no data
      if (count <= 20) return '#a8ddb5'; // light green
      if (count <= 50) return '#43a2ca'; // medium blue
      return '#0868ac'; // dark blue for high numbers
  }

  // Show tooltip
  function showTooltip(text, element) {
      const tooltip = document.getElementById('tooltip');
      tooltip.innerText = text;
      tooltip.style.display = 'block';
      const rect = element.getBoundingClientRect();
      tooltip.style.left = `${rect.left + window.scrollX}px`;
      tooltip.style.top = `${rect.top - tooltip.offsetHeight + window.scrollY}px`;
  }

  // Hide tooltip
  function hideTooltip() {
      const tooltip = document.getElementById('tooltip');
      tooltip.style.display = 'none';
  }

  // Initial heatmap render for the current year
  renderHeatmap(2024);

  // Allow switching years dynamically (buttons for demo)
  document.querySelectorAll('.year-btn').forEach(btn => {
      btn.addEventListener('click', () => renderHeatmap(btn.getAttribute('data-year')));
  });
});
