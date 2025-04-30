import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { getEvents } from '../api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    getEvents()
      .then((res) => setEvents(res.data))
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load events 🚨');
        console.error(err);
      });
  }, []);

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 p-4 xs:p-6 ${theme === 'dark' ? 'bg-dark-gradient' : 'bg-light-gradient'}`}>
      <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4 xs:mb-6 text-center">
        Events 🎫
      </h2>
      {error && <p className="text-red-600 mb-4 text-center text-sm xs:text-base">{error}</p>}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6">
        {events.map((event) => (
          <div key={event._id} className="card">
            <img
              src={event.image || 'https://via.placeholder.com/300'}
              alt={event.title}
              className="w-full h-40 xs:h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {event.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm xs:text-base">
              <strong>Date:</strong> {new Date(event.date).toLocaleString()} 📅
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm xs:text-base">
              <strong>Location:</strong> {event.location} 📍
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm xs:text-base">
              <strong>Price:</strong> ₹{event.price || 'Free'} 💸
            </p>
            <Link
              to={`/events/${event._id}`}
              className="btn-primary"
            >
              View Details 👀
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;