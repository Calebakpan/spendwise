# SpendWise 💸

A fullstack expense manager built with React, Node.js, Express and MySQL.

## Features

- 🔐 JWT authentication — register, login, logout
- 📊 Dashboard with bar chart (monthly) and donut chart (by category)
- ➕ Add, edit and delete expenses
- 📎 Upload receipts (images or PDFs up to 5MB)
- 🔍 Search, filter and sort expenses
- 📱 Fully responsive — mobile, tablet, desktop
- 👤 Profile page with spending breakdown

## Tech Stack

**Frontend:** React 18, React Router v6, Chart.js, Axios  
**Backend:** Node.js, Express, MySQL2, JWT, Bcrypt, Multer  
**Database:** MySQL

---

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MySQL installed and running

### 1. Set up the database

Open MySQL Workbench or terminal and run:

```bash
mysql -u root -p < server/config/setup.sql
```

Or paste the contents of `server/config/setup.sql` into MySQL Workbench and run it.

### 2. Configure the server

```bash
cd server
cp .env.example .env
```

Edit `.env` and fill in your MySQL credentials:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=spendwise
JWT_SECRET=any_long_random_string_here
CLIENT_URL=http://localhost:3000
```

### 3. Install all dependencies

```bash
# From root folder
cd server && npm install
cd ../client && npm install
```

### 4. Run the app

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```
Server runs at http://localhost:5000

**Terminal 2 — Frontend:**
```bash
cd client
npm start
```
App opens at http://localhost:3000

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Sign in |
| GET | /api/auth/me | Get current user |

### Expenses (all require JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/expenses | List expenses (filterable) |
| GET | /api/expenses/stats | Dashboard stats |
| POST | /api/expenses | Create expense |
| PUT | /api/expenses/:id | Update expense |
| DELETE | /api/expenses/:id | Delete expense |

---

## Project Structure

```
spendwise/
├── client/                     # React frontend
│   └── src/
│       ├── components/         # Sidebar, Topbar, ExpenseForm
│       ├── context/            # AuthContext (JWT state)
│       ├── hooks/              # useExpenses, useStats
│       ├── pages/              # Login, Register, Dashboard, Expenses, Profile
│       └── utils/              # api.js (Axios), helpers.js
└── server/                     # Node.js backend
    ├── config/                 # db.js, setup.sql
    ├── controllers/            # authController, expenseController
    ├── middleware/             # auth.js (JWT), upload.js (Multer)
    ├── routes/                 # auth.js, expenses.js
    ├── uploads/                # Receipt files stored here
    └── index.js                # Express entry point
```

Built by [Caleb Akpan]
