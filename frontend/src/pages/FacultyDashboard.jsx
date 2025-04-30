import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { getEvent, getEventRSVPs, getPayments } from '../api';
import Sidebar from '../components/Sidebar';

function FacultyDashboard() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [rsvps, setRSVPs] = useState({ total: 0, rsvps: [] });
  const [payments, setPayments] = useState({ total: 0, totalAmount: 0, payments: [] });
  const [errors, setErrors] = useState({});
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  if (!user || user.role !== 'Faculty') {
    navigate('/');
    return null;
  }

  useEffect(() => {
    getEvent(eventId)
      .then((res) => setEvent(res.data))
      .catch((err) => {
        setErrors((prev) => ({ ...prev, event: 'Failed to load event 🚨' }));
        console.error('Fetch event error:', err);
      });

    getEventRSVPs(eventId)
      .then((res) => setRSVPs(res.data))
      .catch((err) => {
        setErrors((prev) => ({ ...prev, rsvps: 'Failed to load RSVPs 🚨' }));
        console.error('Fetch RSVPs error:', err);
      });

    getPayments(eventId)
      .then((res) => setPayments(res.data))
      .catch((err) => {
        setErrors((prev) => ({ ...prev, payments: 'Failed to load payments 🚨' }));
        console.error('Fetch payments error:', err);
      });
  }, [eventId]);

  if (!event) return <div className="text-center p-4 xs:p-6 text-sm xs:text-base">Loading... ⏳</div>;

  return (
    <div className="min-h-screen flex flex-col xs:flex-row bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-4 xs:p-6 sm:p-8">
        <div className={`card ${theme === 'dark' ? 'bg-dark-gradient' : 'bg-light-gradient'}`}>
          <h2 className="text-xl xs:text-2xl font-bold text-white mb-4 xs:mb-6 text-center">
            Dashboard for {event.name} 📊
          </h2>
          {errors.event && <p className="text-red-600 mb-4 text-center text-sm xs:text-base">{errors.event}</p>}
          <h3 className="text-lg xs:text-xl font-semibold text-white mb-3 xs:mb-4">RSVPs 📋</h3>
          {errors.rsvps && <p className="text-red-600 mb-4 text-sm xs:text-base">{errors.rsvps}</p>}
          <p className="text-white mb-2 text-sm xs:text-base">
            <strong>Total RSVPs:</strong> {rsvps.total} 👥
          </p>
          <div className="overflow-x-auto mb-6 xs:mb-8">
            <table className="w-full border-collapse text-xs xs:text-sm">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="border p-2 text-gray-800 dark:text-white">Student</th>
                  <th className="border p-2 text-gray-800 dark:text-white">Status</th>
                  <th className="border p-2 text-gray-800 dark:text-white">Comments</th>
                  <th className="border p-2 text-gray-800 dark:text-white">RSVP Date</th>
                </tr>
              </thead>
              <tbody>
                {rsvps.rsvps.map((rsvp) => (
                  <tr key={rsvp._id} className="border-b">
                    <td className="border p-2 text-gray-800 dark:text-white">
                      {rsvp.user.firstName} {rsvp.user.lastName} ({rsvp.user.email})
                    </td>
                    <td className="border p-2 text-gray-800 dark:text-white">
                      {rsvp.status} {rsvp.status === 'Attending' ? '✅' : rsvp.status === 'Not Attending' ? '❌' : '❓'}
                    </td>
                    <td className="border p-2 text-gray-800 dark:text-white">
                      {rsvp.comments || 'None'}
                    </td>
                    <td className="border p-2 text-gray-800 dark:text-white">
                      {new Date(rsvp.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="text-lg xs:text-xl font-semibold text-white mb-3 xs:mb-4">Payments 💸</h3>
          {errors.payments && <p className="text-red-600 mb-4 text-sm xs:text-base">{errors.payments}</p>}
          <p className="text-white mb-2 text-sm xs:text-base">
            <strong>Total Payments:</strong> {payments.total} 💳
          </p>
          <p className="text-white mb-4 text-sm xs:text-base">
            <strong>Total Amount:</strong> ₹{payments.totalAmount.toFixed(2)} 💰
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs xs:text-sm">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="border p-2 text-gray-800 dark:text-white">Student</th>
                  <th className="border p-2 text-gray-800 dark:text-white">Amount</th>
                  <th className="border p-2 text-gray-800 dark:text-white">Status</th>
                  <th className="border p-2 text-gray-800 dark:text-white">Payment ID</th>
                  <th className="border p-2 text-gray-800 dark:text-white">Payment Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.payments.map((payment) => (
                  <tr key={payment._id} className="border-b">
                    <td className="border p-2 text-gray-800 dark:text-white">
                      {payment.user.firstName} {payment.user.lastName} ({payment.user.email})
                    </td>
                    <td className="border p-2 text-gray-800 dark:text-white">
                      ₹{payment.amount.toFixed(2)}
                    </td>
                    <td className="border p-2 text-gray-800 dark:text-white">
                      {payment.status} {payment.status === 'completed' ? '✅' : '❌'}
                    </td>
                    <td className="border p-2 text-gray-800 dark:text-white">
                      {payment.razorpayPaymentId || 'N/A'}
                    </td>
                    <td className="border p-2 text-gray-800 dark:text-white">
                      {new Date(payment.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacultyDashboard;