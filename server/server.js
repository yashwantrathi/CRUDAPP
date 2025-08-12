const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Paths to files
const dataFilePath = path.join(__dirname, 'data.json');
const activityLogPath = path.join(__dirname, 'activitylog.json'); // your new log file

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// ===== Utility: read & write users =====
function readData() {
  if (!fs.existsSync(dataFilePath)) fs.writeFileSync(dataFilePath, '[]');
  const jsonData = fs.readFileSync(dataFilePath);
  return JSON.parse(jsonData);
}

function writeData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// ===== Utility: read & write activity log =====
function readLog() {
  if (!fs.existsSync(activityLogPath)) fs.writeFileSync(activityLogPath, '[]');
  const jsonData = fs.readFileSync(activityLogPath);
  return JSON.parse(jsonData);
}

function writeLog(log) {
  fs.writeFileSync(activityLogPath, JSON.stringify(log, null, 2));
}

function logActivity(action, user) {
  let log = readLog();
  log.push({
    action,
    name: user.name,
    email: user.email,
    timestamp: new Date()
  });
  writeLog(log);
}

// ===== Routes =====

// Get all users
app.get('/api/users', (req, res) => {
  const users = readData();
  res.json(users);
});

// Add new user (with server-set timestamp + log)
app.post('/api/users', (req, res) => {
  const users = readData();
  const { name, email, createdAt } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and Email are required." });
  }

  const newUser = {
    name,
    email,
    createdAt: createdAt ? new Date(createdAt) : new Date()
  };

  users.push(newUser);
  writeData(users);
  logActivity("Added", newUser);

  res.status(201).json(newUser);
});

// Update user (preserve createdAt + log)
app.put('/api/users/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  const users = readData();

  if (index < 0 || index >= users.length) {
    return res.status(404).json({ error: "User not found" });
  }

  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and Email are required." });
  }

  const updatedUser = {
    name,
    email,
    createdAt: users[index].createdAt || new Date()
  };

  users[index] = updatedUser;
  writeData(users);
  logActivity("Edited", updatedUser);

  res.json(updatedUser);
});

// Delete user (log action)
app.delete('/api/users/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  const users = readData();

  if (index < 0 || index >= users.length) {
    return res.status(404).json({ error: "User not found" });
  }

  const deleted = users.splice(index, 1);
  writeData(users);
  logActivity("Deleted", deleted[0]);

  res.json(deleted[0]);
});

// Get activity log
app.get('/api/activity-log', (req, res) => {
  const log = readLog();
  res.json(log);
});

// ===== Start server =====
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
