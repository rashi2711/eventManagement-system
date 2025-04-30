import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Placeholder: Backend endpoint needed
    setNotifications([]); // Replace with actual API call
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Notifications</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {notifications.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No notifications available</p>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg"
              >
                <p className="text-gray-800 dark:text-white">{notification.message}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;