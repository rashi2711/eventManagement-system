import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { getUserRSVPs } from '../api';

function StudentDashboard() {
  const [rsvps, setRSVPs] = useState([]);
  const [errors, setErrors] = useState({});
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  if (!user || user.role !== 'Student') {
    navigate('/');
    return null;
  }

  useEffect(() => {
    getUserRSVPs()
      .then((res) => setRSVPs(res.data))
      .catch((err) => {
        setErrors({ fetch: err.response?.data?.message || 'Failed to load RSVPs' });
        console.error('Fetch RSVPs error:', err.response?.data);
      });
  }, []);

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 p-6 ${theme === 'dark' ? 'bg-dark-gradient' : 'bg-light-gradient'}`}>
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          My Event Registrations
        </h2>
        {errors.fetch && <p className="text-red-600 mb-4 text-center">{errors.fetch}</p>}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="border p-2 text-gray-800 dark:text-white">Event Name</th>
                <th className="border p-2 text-gray-800 dark:text-white">Date</th>
                <th className="border p-2 text-gray-800 dark:text-white">Payment Status</th>
                <th className="border p-2 text-gray-800 dark:text-white">RSVP Date</th>
              </tr>
            </thead>
            <tbody>
              {rsvps.length > 0 ? (
                rsvps.map((rsvp) => (
                  <tr key={rsvp._id} className="border-b">
                    <td className="border p-2 text-gray-800 dark:text-white">
                      {rsvp.event.name}
                    </td>
                    <td className="border p-2 text-gray-800 dark:text-white">
                      {new Date(rsvp.event.date).toLocaleDateString()}
                    </td>
                    <td className="border p-2 text-gray-800 dark:text-white">
                      {rsvp.paymentStatus}
                    </td>
                    <td className="border p-2 text-gray-800 dark:text-white">
                      {new Date(rsvp.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border p-2 text-gray-800 dark:text-white text-center">
                    No RSVPs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;