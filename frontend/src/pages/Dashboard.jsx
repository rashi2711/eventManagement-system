import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300 text-sm xs:text-base">Loading...</p>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleBadge = {
    Student: 'bg-blue-600',
    Faculty: 'bg-green-600',
    Admin: 'bg-purple-600',
  };

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-4 xs:p-6 sm:p-8">
        <div className={`bg-white dark:bg-gray-800 p-4 xs:p-6 rounded-lg shadow-lg mb-6 xs:mb-8 ${theme === 'dark' ? 'bg-dark-gradient' : 'bg-light-gradient'}`}>
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div>
              <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                Hi, {user.firstName}!
              </h2>
              <span className={`inline-block mt-2 px-3 py-1 text-sm text-white rounded-full ${roleBadge[user.role]}`}>
                {user.role}
              </span>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm xs:text-base">
                Welcome to your dashboard.{' '}
                {user.role === 'Faculty' ? 'Manage your events or explore as a student.' : 
                 user.role === 'Admin' ? 'Oversee users and events.' : 
                 'Explore events and manage your profile.'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 sm:mt-0 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm xs:text-base"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-6">
          {(user.role === 'Faculty' || user.role === 'Admin') && (
            <div className="bg-white dark:bg-gray-800 p-4 xs:p-6 rounded-lg shadow-lg">
              <h3 className="text-lg xs:text-xl font-semibold text-gray-800 dark:text-white mb-2 xs:mb-3">
                {user.role} Actions
              </h3>
              <button
                onClick={() => navigate('/create-event')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mr-2 text-sm xs:text-base"
              >
                Create Event
              </button>
              <button
                onClick={() => navigate('/payments')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm xs:text-base"
              >
                View Payments
              </button>
              {user.role === 'Admin' && (
                <button
                  onClick={() => navigate('/admin/users')}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 mt-2 text-sm xs:text-base"
                >
                  Manage Users
                </button>
              )}
            </div>
          )}
          <div className="bg-white dark:bg-gray-800 p-4 xs:p-6 rounded-lg shadow-lg">
            <h3 className="text-lg xs:text-xl font-semibold text-gray-800 dark:text-white mb-2 xs:mb-3">Quick Actions</h3>
            <button
              onClick={() => navigate('/events')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mr-2 text-sm xs:text-base"
            >
              View Events
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm xs:text-base"
            >
              Edit Profile
            </button>
            {user.role === 'Student' && (
              <button
                onClick={() => navigate('/tickets')}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 mt-2 text-sm xs:text-base"
              >
                My Tickets
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;