const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Seat = require('../models/Seat');

// GET /api/events - Retrieve a list of all available events.
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({});
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/events/:id - Retrieve details for a single event.
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Also fetch seats for this event
    let seats = await Seat.find({ eventId: event._id }).sort({ seatNumber: 1 });
    
    // Map expired reserved seats to available
    seats = seats.map(seat => {
      if (seat.status === 'reserved' && seat.reservedUntil && seat.reservedUntil < new Date()) {
        seat.status = 'available';
      }
      return seat;
    });

    res.json({ event, seats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
