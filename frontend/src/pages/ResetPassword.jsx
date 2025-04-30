import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { resetPassword } from '../api';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword({ email });
      alert('Reset OTP sent to your email!');
      navigate('/verify-reset-otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset OTP 🚨');
      console.error(err);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 p-4 xs:p-6 ${theme === 'dark' ? 'bg-dark-gradient' : 'bg-light-gradient'}`}>
      <div className="card">
        <h2 className="text-xl xs:text-2xl font-bold text-gray-800 dark:text-white mb-4 xs:mb-6 text-center">
          Reset Password 🔒
        </h2>
        {error && <p className="text-red-600 mb-4 text-center text-sm xs:text-base">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-800 dark:text-white text-sm xs:text-base">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-sm xs:text-base"
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Send Reset OTP 🚀
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;