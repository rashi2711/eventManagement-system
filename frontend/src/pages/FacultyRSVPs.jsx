import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { getEventRSVPs } from '../api';

function FacultyRSVPs() {
  const { eventId } = useParams();
  const [rsvps, setRSVPs] = useState({ totalRSVPs: 0, attendees: 0, rsvps: [] });
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  if (!user || !['Faculty', 'StudentAdmin'].includes(user.role)) {
    navigate('/');
    return null;
  }

  useEffect(() => {
    getEventRSVPs(eventId)
      .then((res) => setRSVPs(res.data))
      .catch((err) => {
        setError('Failed to load RSVPs');
        console.error('Fetch RSVPs error:', err);
      });
  }, [eventId]);

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 p-6 ${theme === 'dark' ? 'bg-dark-gradient' : 'bg-light-gradient'}`}>
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Event RSVPs
        </h2>
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        <p className="text-gray-800 dark:text-white mb-2">
          <strong>Total RSVPs:</strong> {rsvps.totalRSVPs}
        </p>
        <p className="text-gray-800 dark:text-white mb-4">
          <strong>Confirmed Attendees:</strong> {rsvps.attendees}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="border p-2 text-gray-800 dark:text-white">Name</th>
                <th className="border p-2 text-gray-800 dark:text-white">Email</th>
                <th className="border p-2 text-gray-800 dark:text-white">Payment Status</th>
                <th className="border p-2 text-gray-800 dark:text-white">Comments</th>
                <th className="border p-2 text-gray-800 dark:text-white">RSVP Date</th>
              </tr>
            </thead>
            <tbody>
              {rsvps.rsvps.map((rsvp) => (
                <tr key={rsvp._id} className="border-b">
                  <td className="border p-2 text-gray-800 dark:text-white">
                    {rsvp.user.firstName} {rsvp.user.lastName}
                  </td>
                  <td className="border p-2 text-gray-800 dark:text-white">
                    {rsvp.user.email}
                  </td>
                  <td className="border p-2 text-gray-800 dark:text-white">
                    {rsvp.paymentStatus}
                  </td>
                  <td className="border p-2 text-gray-800 dark:text-white">
                    {rsvp.comments || 'None'}
                  </td>
                  <td className="border p-2 text-gray-800 dark:text-white">
                    {new Date(rsvp.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FacultyRSVPs;