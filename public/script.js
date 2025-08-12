// DOM Elements
const form = document.getElementById("crudForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const tableBody = document.querySelector("#dataTable tbody");
const searchInput = document.getElementById("searchInput");
const darkModeToggle = document.getElementById("darkModeToggle");
const exportBtn = document.getElementById("exportPdfBtn");
const toast = document.getElementById("toast");

let editingIndex = null;
let data = [];

// Show toast message
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

// Fetch & render data from backend
async function fetchData() {
  try {
    const response = await fetch("/api/users");
    data = await response.json();
    renderTable(data);
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

// Render table rows (blank circle as avatar + Added On column)
function renderTable(arr) {
  tableBody.innerHTML = "";
  arr.forEach((item, index) => {
    // Format timestamp or show dash if missing
    let dateStr = item.createdAt
      ? new Date(item.createdAt).toLocaleString()
      : "-";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><div class="avatar"></div></td>
      <td>${item.name}</td>
      <td>${item.email}</td>
      <td>${dateStr}</td>
      <td>
        <button class="edit-btn" data-edit="${index}">✏️ Edit</button>
        <button class="delete-btn" data-del="${index}">🗑️ Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Add/Edit user
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  if (!name || !email) return;

  if (editingIndex === null) {
    // Add new user with timestamp
    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        createdAt: new Date() // timestamp field
      }),
    });
    showToast("User added!");
  } else {
    // Update existing (keep old timestamp if present)
    const existingTime = data[editingIndex].createdAt || new Date();
    await fetch(`/api/users/${editingIndex}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        createdAt: existingTime
      }),
    });
    editingIndex = null;
    showToast("User updated!");
  }

  nameInput.value = "";
  emailInput.value = "";
  fetchData();
});

// Edit/Delete actions
tableBody.addEventListener("click", async (e) => {
  if (e.target.classList.contains("edit-btn")) {
    const index = e.target.getAttribute("data-edit");
    nameInput.value = data[index].name;
    emailInput.value = data[index].email;
    editingIndex = index;
    showToast("Editing user");
  }
  if (e.target.classList.contains("delete-btn")) {
    const index = e.target.getAttribute("data-del");
    if (confirm("Delete this user?")) {
      await fetch(`/api/users/${index}`, { method: "DELETE" });
      showToast("User deleted");
      fetchData();
    }
  }
});

// Live search filter
searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  const filtered = data.filter(
    (item) =>
      item.name.toLowerCase().includes(term) ||
      item.email.toLowerCase().includes(term)
  );
  renderTable(filtered);
});

// Dark mode toggle
darkModeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode", darkModeToggle.checked);
});

// Export to PDF including Added On column
exportBtn.addEventListener("click", () => {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    showToast("PDF export not available");
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("User Data", 14, 10);
  const rows = data.map((u) => [
    u.name,
    u.email,
    u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"
  ]);
  doc.autoTable({ head: [["Name", "Email", "Added On"]], body: rows });
  doc.save("user_data.pdf");
});

// Init load
fetchData();
