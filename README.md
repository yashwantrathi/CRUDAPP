<<<<<<< HEAD
=======
# CRUDAPP
>>>>>>> 9ac8691dba57969506054845a468203866cab52b
## **README.md**
DEMO OF THE PROJECT :- https://drive.google.com/file/d/1jxjAA_I2IA4dXABOu6kWz4o3_N0fYNzV/view?usp=drive_link

# UserFlow — Smart People & Activity Manager

A modern, animated user management web application with real-time analytics and activity tracking. Built with Node.js, Express, and vanilla JavaScript.

## 🚀 Features

### Main Application
- **Add, Edit, Delete Users** - Complete CRUD operations with a beautiful UI
- **Real-time Search** - Instantly filter users by name or email  
- **PDF Export** - Download user data as PDF reports
- **Animated UI** - Beautiful backgrounds with floating particles and gradients
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile

### Admin Dashboard  
- **Analytics Overview** - See total users, daily adds/deletes, weekly stats
- **Interactive Charts** - Visual bar charts showing user growth over time
- **Activity Log** - Complete history of all add/edit/delete actions with timestamps
- **Password Protection** - Secure admin access
- **Clean Interface** - Professional dashboard separate from main app

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Charts**: Chart.js
- **Icons**: Font Awesome
- **PDF Generation**: jsPDF with AutoTable
- **Data Storage**: JSON files

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone or download this project**
2. **Install dependencies**
   ```bash
   npm install express cors
   ```
3. **Start the server**
   ```bash
   cd server
   node server.js
   ```
4. **Open your browser**
   - Go to `http://localhost:3000`
   - Enjoy your modern user management app!

## 📖 How to Use

### Main App
1. **Add Users**: Fill in name and email, click "Add User"
2. **Search Users**: Type in the search box to filter instantly
3. **Edit Users**: Click the ✏️ Edit button next to any user
4. **Delete Users**: Click the 🗑️ Delete button
5. **Export Data**: Click "Export Data (PDF)" to download user list
6. **Dark Mode**: Toggle the switch in the header

### Admin Dashboard
1. **Access**: Click the admin shield icon in the header
2. **Password**: Enter admin password (default: `yash`)  
3. **View Analytics**: See user statistics and growth charts
4. **Activity Log**: Review all actions with timestamps

## ⚙️ Configuration

### Change Admin Password
In `index.html`, find this line and change the password:
```javascript
if (pass === "admin123") { // Change "admin123" to your password
```

## 🔧 Troubleshooting

### Server won't start?
- Make sure you're in the `server/` directory
- Run `node server.js` (not `server,js`)

### Admin page not working?
- Check admin password in `index.html`
- Make sure Chart.js is loading properly

## 👨💻 Author

Created by **Yashwanth Rathi**  
Engineering student passionate about web development.
***

**UserFlow** - Making user management beautiful and efficient! ✨
