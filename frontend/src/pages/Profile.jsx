import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { getProfile, updateProfile } from '../api';
import Sidebar from '../components/Sidebar';

const Profile = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    getProfile()
      .then((res) => setFormData(res.data))
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load profile 🚨');
        console.error(err);
      });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      alert('Profile updated successfully 🌟');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile 🚨');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col xs:flex-row bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-4 xs:p-6 sm:p-8">
        <div className={`card ${theme === 'dark' ? 'bg-dark-gradient' : 'bg-light-gradient'}`}>
          <h2 className="text-xl xs:text-2xl font-bold text-gray-800 dark:text-white mb-4 xs:mb-6 text-center">
            Profile 👤
          </h2>
          {error && <p className="text-red-600 mb-4 text-center text-sm xs:text-base">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium text-gray-800 dark:text-white text-sm xs:text-base">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-sm xs:text-base"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-800 dark:text-white text-sm xs:text-base">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-sm xs:text-base"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-800 dark:text-white text-sm xs:text-base">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-sm xs:text-base"
                required
                disabled
              />
            </div>
            <button type="submit" className="btn-primary">
              Update Profile 🚀
            </button>
          </form>
          <p className="mt-4 text-center text-sm xs:text-base text-gray-600 dark:text-gray-300">
            Want to change your password?{' '}
            <button
              onClick={() => navigate('/change-password')}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Click here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;