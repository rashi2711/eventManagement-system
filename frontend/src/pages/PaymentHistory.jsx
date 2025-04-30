import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { getPayments } from '../api';
import Sidebar from '../components/Sidebar';

const PaymentHistory = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  useEffect(() => {
    getPayments()
      .then((res) => setPayments(res.data.payments))
      .catch((err) => setError('Failed to load payment history 🚨'));
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-4 xs:p-6 sm:p-8">
        <div className={`bg-white dark:bg-gray-800 p-4 xs:p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-dark-gradient' : 'bg-light-gradient'}`}>
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4 xs:mb-6">
            Payment History 📜
          </h2>
          {error && <p className="text-red-600 mb-4 text-sm xs:text-base">{error}</p>}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs xs:text-sm">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="border p-2 text-gray-800 dark:text-white">Event</th>
                  <th className="border p-2 text-gray-800 dark:text-white">Amount</th>
                  <th className="border p-2 text-gray-800 dark:text-white">Status</th>
                  <th className="border p-2 text-gray-800 dark:text-white">Payment ID</th>
                  <th className="border p-2 text-gray-800 dark:text-white">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.length > 0 ? (
                  payments.map((payment) => (
                    <tr key={payment._id} className="border-b">
                      <td className="border p-2 text-gray-800 dark:text-white">{payment.event?.name || 'N/A'}</td>
                      <td className="border p-2 text-gray-800 dark:text-white">₹{payment.amount.toFixed(2)}</td>
                      <td className="border p-2 text-gray-800 dark:text-white">{payment.status}</td>
                      <td className="border p-2 text-gray-800 dark:text-white">{payment.razorpayPaymentId || 'N/A'}</td>
                      <td className="border p-2 text-gray-800 dark:text-white">{new Date(payment.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="border p-2 text-gray-800 dark:text-white text-center">
                      No payment history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;