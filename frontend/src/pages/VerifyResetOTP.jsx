import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { verifyResetOTP } from '../api';

const VerifyResetOTP = () => {
  const [formData, setFormData] = useState({ email: '', otp: '', newPassword: '' });
  const [error, setError] = useState('');
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyResetOTP(formData);
      alert('Password reset successfully! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password 🚨');
      console.error('Reset OTP error:', err);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 p-4 xs:p-6 ${theme === 'dark' ? 'bg-dark-gradient' : 'bg-light-gradient'}`}>
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 xs:p-8 rounded-lg shadow-lg">
        <h2 className="text-xl xs:text-2xl font-bold text-gray-800 dark:text-white mb-4 xs:mb-6 text-center">
          Verify Reset OTP 🔐
        </h2>
        {error && <p className="text-red-600 mb-4 text-center text-sm xs:text-base">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-800 dark:text-white text-sm xs:text-base">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-gray-300 text-sm xs:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-800 dark:text-white text-sm xs:text-base">OTP</label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-gray-300 text-sm xs:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter OTP"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-800 dark:text-white text-sm xs:text-base">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-gray-300 text-sm xs:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm xs:text-base transition-colors"
          >
            Reset Password
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-300 text-sm xs:text-base">
          Back to <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyResetOTP;