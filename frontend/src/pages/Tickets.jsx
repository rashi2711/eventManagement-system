import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { getUserRSVPs } from '../api';
import Sidebar from '../components/Sidebar';

const Tickets = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');

  if (!user || user.role !== 'Student') {
    navigate('/');
    return null;
  }

  useEffect(() => {
    getUserRSVPs()
      .then((res) => setTickets(res.data))
      .catch((err) => setError('Failed to load tickets 🚨'));
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-4 xs:p-6 sm:p-8">
        <div className={`bg-white dark:bg-gray-800 p-4 xs:p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-dark-gradient' : 'bg-light-gradient'}`}>
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4 xs:mb-6">
            My Tickets 🎟️
          </h2>
          {error && <p className="text-red-600 mb-4 text-sm xs:text-base">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6">
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <div key={ticket._id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
                  <h3 className="text-lg xs:text-xl font-semibold text-gray-800 dark:text-white">{ticket.event.name}</h3>
                  <p className="text-sm xs:text-base text-gray-600 dark:text-gray-300">
                    Date: {new Date(ticket.event.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm xs:text-base text-gray-600 dark:text-gray-300">
                    Status: {ticket.paymentStatus}
                  </p>
                  <button
                    onClick={() => navigate(`/events/${ticket.event._id}`)}
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm xs:text-base"
                  >
                    View Event
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-300 text-sm xs:text-base">No tickets found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tickets;