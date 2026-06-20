const express = require('express');
const router = express.Router();
const Seat = require('../models/Seat');
const Reservation = require('../models/Reservation');
const { protect } = require('../middleware/auth');

// POST /api/bookings - Confirm booking for reserved seats
router.post('/', protect, async (req, res) => {
  const { reservationId } = req.body;
  const userId = req.user._id;

  try {
    const reservation = await Reservation.findOne({ _id: reservationId, userId });

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found or has expired' });
    }

    // Update the seats status to 'booked'
    await Seat.updateMany(
      { 
        eventId: reservation.eventId, 
        seatNumber: { $in: reservation.seatNumbers },
        status: 'reserved' 
      },
      { $set: { status: 'booked' } }
    );

    // Remove the reservation
    await Reservation.findByIdAndDelete(reservationId);

    res.status(200).json({ message: 'Booking confirmed successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
