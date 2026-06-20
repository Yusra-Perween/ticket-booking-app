import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin } from 'lucide-react';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/events');
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading events...</div>;

  return (
    <div>
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', background: 'linear-gradient(to right, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
          Upcoming Events
        </h1>
        <p>Book your tickets for the best shows in town.</p>
      </div>

      <div className="events-grid">
        {events.map((event) => (
          <Link to={`/events/${event._id}`} key={event._id} className="event-card">
            <img src={event.imageUrl} alt={event.name} className="event-image" />
            <div className="event-info">
              <h3>{event.name}</h3>
              <div className="event-meta">
                <Calendar size={16} />
                {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="event-meta">
                <MapPin size={16} />
                {event.venue}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
