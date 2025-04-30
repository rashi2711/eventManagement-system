import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar';
import jsPDF from 'jspdf';

const PaymentReceipt = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const generateReceipt = () => {
    try {
      const doc = new jsPDF();
      doc.text('EventSphere Payment Receipt', 20, 20);
      doc.text(`User: ${user.firstName} ${user.lastName}`, 20, 30);
      doc.text(`Email: ${user.email}`, 20, 40);
      doc.text(`Date: ${new Date().toLocaleString()}`, 20, 50);
      doc.text('Sample Receipt - Replace with actual payment data', 20, 60);
      doc.save(`receipt_${user._id}.pdf`);
    } catch (err) {
      setError('Failed to generate receipt 🚨');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-4 xs:p-6 sm:p-8">
        <div className={`bg-white dark:bg-gray-800 p-4 xs:p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-dark-gradient' : 'bg-light-gradient'}`}>
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4 xs:mb-6">
            Payment Receipt 📄
          </h2>
          {error && <p className="text-red-600 mb-4 text-sm xs:text-base">{error}</p>}
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm xs:text-base">
            Download your payment receipt as a PDF.
          </p>
          <button
            onClick={generateReceipt}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm xs:text-base"
          >
            Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceipt;