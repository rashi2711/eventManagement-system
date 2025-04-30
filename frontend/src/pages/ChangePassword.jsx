import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { changePassword } from '../api';
import Sidebar from '../components/Sidebar';

const ChangePassword = () => {
  const [formData, setFormData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirm password do not match 🚨');
      return;
    }
    try {
      await changePassword({ oldPassword: formData.oldPassword, newPassword: formData.newPassword });
      alert('Password changed successfully 🌟');
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password 🚨');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col xs:flex-row bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-4 xs:p-6 sm:p-8">
        <div className={`card ${theme === 'dark' ? 'bg-dark-gradient' : 'bg-light-gradient'}`}>
          <h2 className="text-xl xs:text-2xl font-bold text-gray-800 dark:text-white mb-4 xs:mb-6 text-center">
            Change Password 🔒
          </h2>
          {error && <p className="text-red-600 mb-4 text-center text-sm xs:text-base">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium text-gray-800 dark:text-white text-sm xs:text-base">Old Password</label>
              <input
                type="password"
                value={formData.oldPassword}
                onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-sm xs:text-base"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-800 dark:text-white text-sm xs:text-base">New Password</label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-sm xs:text-base"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-800 dark:text-white text-sm xs:text-base">Confirm New Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-sm xs:text-base"
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              Change Password 🚀
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;