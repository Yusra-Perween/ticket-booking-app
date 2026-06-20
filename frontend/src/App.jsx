import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { LogOut, User } from 'lucide-react';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Login from './pages/Login';

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Router>
      <div className="container">
        <nav className="navbar">
          <Link to="/" className="logo">SORT MY SCENE</Link>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {user ? (
              <>
                <span style={{ color: 'var(--text-muted)' }}>
                  <User size={16} style={{ display: 'inline', marginRight: '5px' }} />
                  {user.email}
                </span>
                <button onClick={logout} className="btn-primary" style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary">Login</Link>
            )}
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
