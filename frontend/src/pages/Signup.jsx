import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { signup } from '../api';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'Student',
  });
  const [error, setError] = useState('');
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(formData);
      alert('Signup successful! Please verify your OTP.');
      navigate('/verify-otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to signup 🚨');
      console.error(err);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 p-4 xs:p-6 ${theme === 'dark' ? 'bg-dark-gradient' : 'bg-light-gradient'}`}>
      <div className="card">
        <h2 className="text-xl xs:text-2xl font-bold text-gray-800 dark:text-white mb-4 xs:mb-6 text-center">
          Signup 📝
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
            />
          </div>
          <div>
            <label className="block font-medium text-gray-800 dark:text-white text-sm xs:text-base">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-sm xs:text-base"
              required
            />
          </div>
          <div>
            <label className="block font-medium text-gray-800 dark:text-white text-sm xs:text-base">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-sm xs:text-base"
            >
              <option value="Student">Student 👨‍🎓</option>
              <option value="Faculty">Faculty 👩‍🏫</option>
            </select>
          </div>
          <button type="submit" className="btn-primary">
            Signup 🚀
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;