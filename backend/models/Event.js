const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  totalSeats: { type: Number, required: true },
  imageUrl: { type: String, default: 'https://images.unsplash.com/photo-1540039155732-6847368222eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
