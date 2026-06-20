# Event Ticket Booking App

A premium MERN stack application for event ticket booking, built to demonstrate full-stack capabilities, modern UI/UX design, and complex backend concurrency management.

## Features
- **Premium User Interface**: Built with React and Vanilla CSS, featuring glassmorphism, responsive design, and smooth animations.
- **Seat Reservation Flow**: Real-time seat grid displaying available, reserved, and booked seats.
- **Concurrency Control**: Prevents double-booking using atomic MongoDB operations (`updateMany`) without requiring replica-set transactions. This ensures a robust and safe reservation system even on standalone MongoDB instances.
- **Natural Expiration**: Uses `reservedUntil` timestamps combined with atomic queries to allow natural expiration of 10-minute reservations without needing background cron jobs.
- **Authentication**: JWT-based secure user authentication.

## Tech Stack
- **Frontend**: React (Vite), React Router, Axios, Lucide React icons.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, BcryptJS.

## Running the Application

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally on `localhost:27017`

### 2. Backend Setup
```bash
cd backend
npm install
# Seed the database with sample events and seats
npm run seed  # note: run `node seeders/seed.js` manually if no script is defined
# Start the server
node server.js
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

## Design Decisions
1. **Concurrency Control**: Instead of relying on Mongoose transactions (which require a MongoDB replica set), we use atomic `updateMany` queries with a unique `reservationToken`. If the query fails to reserve the exact number of requested seats (due to concurrent access), it automatically rolls back the successfully reserved seats using the token.
2. **Reservation Expiration**: Instead of a background worker to clean up expired reservations, the seat schema includes a `reservedUntil` field. The query logic natively allows booking a "reserved" seat if its `reservedUntil` time is in the past.
3. **Styling**: Vanilla CSS was used to achieve a very custom, premium look while adhering to constraints avoiding utility classes like Tailwind unless explicitly requested.

## Assumptions
- A local MongoDB instance is available.
- 10 minutes is a hard limit for holding a ticket reservation.
