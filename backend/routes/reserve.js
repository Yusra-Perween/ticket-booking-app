const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Seat = require('../models/Seat');
const Reservation = require('../models/Reservation');
const { protect } = require('../middleware/auth');

// POST /api/reserve - Reserve available seats for a specific event for 10 minutes
router.post('/', protect, async (req, res) => {
  const { eventId, seatNumbers } = req.body;
  const userId = req.user._id;

  if (!eventId || !seatNumbers || seatNumbers.length === 0) {
    return res.status(400).json({ message: 'Please provide eventId and seatNumbers' });
  }

  try {
    // We use a unique token to identify our atomic update batch
    const reservationToken = new mongoose.Types.ObjectId().toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Attempt to reserve all requested seats atomically
    // Includes seats that are 'available' OR 'reserved' but their reservation has expired
    const result = await Seat.updateMany(
      { 
        eventId, 
        seatNumber: { $in: seatNumbers }, 
        $or: [
          { status: 'available' },
          { status: 'reserved', reservedUntil: { $lt: new Date() } }
        ]
      },
      { 
        $set: { 
          status: 'reserved',
          reservationToken,
          reservedUntil: expiresAt
        } 
      }
    );

    // If we didn't update exactly the requested number of seats, someone else took some
    if (result.modifiedCount !== seatNumbers.length) {
      // Rollback: unreserve ONLY the seats we successfully updated in this batch
      await Seat.updateMany(
        { reservationToken }, 
        { $set: { status: 'available', reservationToken: null, reservedUntil: null } }
      );
      return res.status(400).json({ message: 'Some seats are already reserved or booked. Please try again.' });
    }

    // Create reservation record
    const reservation = await Reservation.create({
      userId,
      eventId,
      seatNumbers,
      expiresAt
    });

    res.status(200).json({ 
      message: 'Seats reserved successfully',
      reservation 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
