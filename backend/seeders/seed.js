const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('../models/Event');
const Seat = require('../models/Seat');

const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');

    await Event.deleteMany();
    await Seat.deleteMany();

    const event1 = await Event.create({
      name: 'Coldplay Music of the Spheres',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      venue: 'Wembley Stadium',
      totalSeats: 60,
      imageUrl: 'https://images.unsplash.com/photo-1540039155732-6847368222eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    });

    const event2 = await Event.create({
      name: 'Tech Innovators Conference 2026',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      venue: 'Silicon Valley Convention Center',
      totalSeats: 40,
      imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    });

    // Generate seats for event 1 (60 seats)
    const seats1 = [];
    for (let i = 1; i <= 60; i++) {
      seats1.push({
        eventId: event1._id,
        seatNumber: `A${i}`,
        status: i % 15 === 0 ? 'booked' : (i % 7 === 0 ? 'reserved' : 'available')
      });
    }
    await Seat.insertMany(seats1);

    // Generate seats for event 2 (40 seats)
    const seats2 = [];
    for (let i = 1; i <= 40; i++) {
      seats2.push({
        eventId: event2._id,
        seatNumber: `B${i}`,
        status: 'available'
      });
    }
    await Seat.insertMany(seats2);

    console.log('Database seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
