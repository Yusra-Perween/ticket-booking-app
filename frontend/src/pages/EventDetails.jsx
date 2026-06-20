import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Timer, CheckCircle, AlertCircle } from 'lucide-react';

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reservation, setReservation] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchEventDetails = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/events/${id}`);
      setEvent(data.event);
      setSeats(data.seats);
    } catch (error) {
      console.error('Error fetching event details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
    // Polling for seat updates every 5 seconds to keep it live
    const intervalId = setInterval(fetchEventDetails, 5000);
    return () => clearInterval(intervalId);
  }, [id]);

  useEffect(() => {
    if (reservation && timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && reservation) {
      // Reservation expired
      setReservation(null);
      setSelectedSeats([]);
      setError('Your reservation has expired. Please select seats again.');
      fetchEventDetails();
    }
  }, [timeLeft, reservation]);

  const toggleSeat = (seatNumber, status) => {
    if (status !== 'available' || reservation) return;
    
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleReserve = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setError('');
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const { data } = await axios.post(
        'http://localhost:5000/api/reserve',
        { eventId: id, seatNumbers: selectedSeats },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setReservation(data.reservation);
      // Calculate remaining seconds
      const expiresAt = new Date(data.reservation.expiresAt).getTime();
      const now = new Date().getTime();
      setTimeLeft(Math.floor((expiresAt - now) / 1000));
      
      // Update local seats
      setSeats(seats.map(s => selectedSeats.includes(s.seatNumber) ? { ...s, status: 'reserved' } : s));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reserve seats');
      setSelectedSeats([]);
      fetchEventDetails(); // refresh seats
    }
  };

  const handleConfirmBooking = async () => {
    setError('');
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      await axios.post(
        'http://localhost:5000/api/bookings',
        { reservationId: reservation._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccess(true);
      setReservation(null);
      setSelectedSeats([]);
      fetchEventDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to confirm booking');
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading event details...</div>;
  if (!event) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Event not found</div>;

  if (success) {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem', padding: '3rem', background: 'var(--bg-card)', borderRadius: 'var(--border-radius)' }}>
        <CheckCircle size={64} color="var(--seat-selected)" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ color: 'var(--seat-selected)' }}>Booking Confirmed!</h2>
        <p>Your tickets for {event.name} have been successfully booked.</p>
        <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: '2rem' }}>
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>{event.name}</h1>
        <p>{event.venue} • {new Date(event.date).toLocaleDateString()}</p>
      </div>

      {error && (
        <div className="error-msg" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={20} /> {error}
        </div>
      )}

      <div className="seat-map-container">
        <div className="screen-indicator">Stage</div>
        
        <div className="seat-grid">
          {seats.map(seat => (
            <div 
              key={seat._id}
              className={`seat ${seat.status} ${selectedSeats.includes(seat.seatNumber) ? 'selected' : ''}`}
              onClick={() => toggleSeat(seat.seatNumber, seat.status)}
            >
              {seat.seatNumber}
            </div>
          ))}
        </div>

        <div className="seat-legend">
          <div className="legend-item"><div className="legend-color" style={{ background: 'var(--seat-available)' }}></div> Available</div>
          <div className="legend-item"><div className="legend-color" style={{ background: 'var(--seat-selected)' }}></div> Selected</div>
          <div className="legend-item"><div className="legend-color" style={{ background: 'var(--seat-reserved)' }}></div> Reserved</div>
          <div className="legend-item"><div className="legend-color" style={{ background: 'var(--seat-booked)' }}></div> Booked</div>
        </div>
      </div>

      {/* Checkout Bar */}
      <div className={`checkout-bar ${selectedSeats.length > 0 ? 'visible' : ''}`}>
        <div className="container checkout-content">
          <div>
            <h3>{selectedSeats.length} Seat{selectedSeats.length !== 1 ? 's' : ''} Selected</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
              {selectedSeats.join(', ')}
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {reservation ? (
              <>
                <div className="timer-container">
                  <Timer size={18} />
                  {formatTime(timeLeft)} left
                </div>
                <button onClick={handleConfirmBooking} className="btn-primary" style={{ background: 'var(--seat-selected)', boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)' }}>
                  Confirm Booking
                </button>
              </>
            ) : (
              <button onClick={handleReserve} className="btn-primary">
                Reserve Seats
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Spacer so the bottom bar doesn't overlap content */}
      <div style={{ height: '100px' }}></div>
    </div>
  );
}
