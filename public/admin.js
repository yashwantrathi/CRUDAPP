// Fetch users and activity log from backend
async function fetchAll() {
  const users = await fetch('/api/users').then(r => r.json());
  const log = await fetch('/api/activity-log').then(r => r.json());
  return { users, log };
}

// Fill analytics dashboard stats
function fillStats(users, log) {
  // Get today's date as string
  const todayStr = new Date().toDateString();
  const now = new Date();

  // Counters
  let usersAddedToday = 0;
  let usersDeletedToday = 0;
  let usersAddedThisWeek = 0;

  log.forEach(ev => {
    const date = new Date(ev.timestamp);
    // Users added today/this week
    if (ev.action === "Added") {
      if (date.toDateString() === todayStr) usersAddedToday++;
      if ((now - date) / (1000 * 60 * 60 * 24) < 7) usersAddedThisWeek++;
    }
    // Users deleted today
    if (ev.action === "Deleted" && date.toDateString() === todayStr) {
      usersDeletedToday++;
    }
  });

  document.getElementById('totalUsers').textContent = users.length;
  document.getElementById('usersToday').textContent = usersAddedToday;
  document.getElementById('usersDeletedToday').textContent = usersDeletedToday;
  document.getElementById('usersWeek').textContent = usersAddedThisWeek;
}

// Render user growth (added actions per day for last 7 days)
function fillChart(log) {
  // Group "Added" actions by day
  const dates = {};
  log.forEach(ev => {
    if (ev.action === "Added" && ev.timestamp) {
      const day = new Date(ev.timestamp).toLocaleDateString();
      dates[day] = (dates[day] || 0) + 1;
    }
  });

  // Prepare chart data
  const dayLabels = [];
  const counts = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const lbl = d.toLocaleDateString();
    dayLabels.push(lbl);
    counts.push(dates[lbl] || 0);
  }

  // Fix: prevent bars from crossing the top
  const maxBar = Math.max(...counts);
  let suggestedMax = maxBar < 5 ? 5 : Math.ceil(maxBar * 1.2);

  new Chart(document.getElementById('userGrowthChart'), {
    type: 'bar',
    data: {
      labels: dayLabels,
      datasets: [{
        label: 'Users Added',
        data: counts,
        backgroundColor: '#24d6cebb'
      }]
    },
    options: {
      responsive: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax: suggestedMax // <-- fix for crossing!
        }
      }
    }
  });
}
// Populate Activity Log table w/ all events, newest first
function fillLog(log) {
  const tbody = document.getElementById("activityTable").querySelector("tbody");
  tbody.innerHTML = "";
  // Show newest actions first
  log.slice().reverse().forEach(ev => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${ev.action}</td>
      <td>${ev.name || '-'}</td>
      <td>${ev.email || '-'}</td>
      <td>${ev.timestamp ? new Date(ev.timestamp).toLocaleString() : '-'}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Initial load: fill stats, chart, and activity log
fetchAll().then(({ users, log }) => {
  fillStats(users, log);
  fillChart(log);
  fillLog(log);
});
