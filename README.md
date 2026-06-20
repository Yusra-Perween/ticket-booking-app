<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens" alt="JWT" />
  
  <br />
  <br />

  <h1>🎟️ Sort My Scene - Premium Event Booking</h1>
  <p>
    <strong>A high-performance, full-stack MERN application demonstrating complex concurrency control, robust state management, and modern UI/UX principles.</strong>
  </p>
</div>

<hr />

## 🌟 Overview
**Sort My Scene** is a sophisticated event ticket booking platform built to handle real-world challenges like concurrent seat reservations. Designed with a focus on both technical excellence and premium aesthetics, this project showcases my ability to deliver end-to-end solutions that are scalable, secure, and visually stunning.

### 🎯 Key Highlights for Interviewers
1. **Concurrency Management Without Replica Sets:** Engineered an innovative atomic `updateMany` locking mechanism with a `reservationToken` to strictly prevent double-booking on standalone MongoDB instances, bypassing the need for complex Replica-Set transactions.
2. **Cron-less Natural Expiration:** Designed a self-cleaning data model using `reservedUntil` timestamps, allowing natural 10-minute reservation expirations without relying on heavy background worker processes.
3. **Premium UI/UX:** Built a custom design system from scratch using Vanilla CSS, featuring glassmorphism, responsive grid layouts, and fluid micro-animations (bypassing the need for heavy CSS frameworks).

<br />

## 🚀 Features
- 🔐 **Secure Authentication:** JWT-based user login and registration with Bcrypt password hashing.
- 💺 **Interactive Seat Map:** A dynamic grid displaying real-time statuses (Available, Selected, Reserved, Booked).
- ⏳ **Live Countdown Timer:** Real-time 10-minute reservation holds seamlessly synchronized with the backend.
- 📱 **Fully Responsive:** Flawless experience across desktops, tablets, and mobile devices.
- 🎨 **Modern Aesthetics:** Dark-mode optimized, sleek gradients, and premium typography.

<br />

## 🛠️ Technology Stack
| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React (Vite), React Router, Axios, Lucide React Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Security** | JSON Web Tokens (JWT), Bcrypt.js, CORS |

<br />

## ⚙️ Local Setup & Installation

Follow these steps to run the application locally.

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** running locally on `localhost:27017`

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Seed the database with sample events and seats
node seeders/seed.js

# Start the development server
node server.js
```

### 3. Frontend Setup
```bash
# Open a new terminal window
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

<br />

## 🧠 Architectural Decisions & Problem Solving

#### 1. The Double-Booking Problem
* **Challenge:** When two users attempt to book the exact same seat simultaneously, standard database queries can result in a race condition.
* **Solution:** Used MongoDB's atomic operators. The system attempts an `updateMany` strictly on seats with `status: 'available'`. A unique `reservationToken` is attached during this operation. If the modified count doesn't match the requested seats, the system instantly rolls back the partial reservation using that token.

#### 2. Managing Expired Reservations
* **Challenge:** Holding a seat for 10 minutes usually requires a cron-job running every minute to free up expired seats, which is resource-intensive.
* **Solution:** Implemented "Lazy Expiration". The Seat schema includes a `reservedUntil` timestamp. When the frontend or backend queries for available seats, any seat where `reservedUntil < Date.now()` is mathematically treated as `available`.

<br />

---
<div align="center">
  <i>Designed and developed by <b>Yusra Perween</b>. Ready to make an impact.</i>
</div>
