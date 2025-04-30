import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { getEvent, createRSVP, createOrder, verifyPayment } from '../api';

function RSVPForm() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({ comments: '', status: 'Attending' });
  const [errors, setErrors] = useState({});
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'Student') {
      navigate('/');
      return;
    }
    getEvent(eventId)
      .then((res) => {
        const eventData = res.data;
        const now = new Date();
        const deadline = new Date(eventData.rsvpDeadline);
        const rsvpCount = eventData.rsvpCount || 0;
        if (now > deadline) {
          setErrors({ deadline: 'RSVP deadline has passed ⏰' });
          return;
        }
        if (rsvpCount >= eventData.capacity) {
          setErrors({ capacity: 'Event is fully booked 😔' });
          return;
        }
        setEvent(eventData);
      })
      .catch((err) => {
        setErrors({ fetch: 'Failed to load event 🚨' });
        console.error('Fetch event error:', err);
      });
  }, [eventId, user, navigate]);

  const generateReceipt = (paymentDetails) => {
    const receiptElement = document.createElement('div');
    receiptElement.innerHTML = `
      <div style="padding: 20px; font-family: Inter, sans-serif;">
        <h2 style="color: #2563eb; font-size: 1.5rem;">EventSphere Payment Receipt 🎉</h2>
        <p><strong>Event:</strong> ${event.name}</p>
        <p><strong>Student:</strong> ${user.firstName} ${user.lastName}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Amount:</strong> ₹${paymentDetails.amount / 100}</p>
        <p><strong>Payment ID:</strong> ${paymentDetails.razorpay_payment_id}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      </div>
    `;
    html2pdf().from(receiptElement).save(`receipt_${paymentDetails.razorpay_payment_id}.pdf`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) return;

    try {
      const rsvpRes = await createRSVP(eventId, formData);
      const rsvpId = rsvpRes.data._id;

      if (event.price > 0) {
        const orderRes = await createOrder(eventId, rsvpId);
        const options = {
          key: 'YOUR_RAZORPAY_KEY', // Replace with actual key
          amount: orderRes.data.amount,
          currency: orderRes.data.currency,
          order_id: orderRes.data.razorpayOrderId,
          name: 'EventSphere',
          description: `Payment for ${event.name}`,
          image: '/logo.png',
          handler: async (response) => {
            try {
              const paymentData = {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                rsvpId,
              };
              await verifyPayment(paymentData);
              generateReceipt(response);
              alert('Payment successful! Receipt downloaded 📄');
              navigate('/my-rsvps');
            } catch (err) {
              setErrors({ payment: 'Payment verification failed 😞' });
              console.error('Payment error:', err);
            }
          },
          prefill: {
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
          },
          theme: {
            color: '#2563eb',
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', () => {
          setErrors({ payment: 'Payment failed. Please try again 💳' });
        });
        rzp.open();
      } else {
        alert('RSVP submitted successfully 🎉');
        navigate('/my-rsvps');
      }
    } catch (err) {
      setErrors({ rsvp: err.response?.data?.message || 'Failed to submit RSVP 🚨' });
      console.error('RSVP error:', err);
    }
  };

  if (!event && !errors.deadline && !errors.capacity) {
    return <div className="text-center p-4 xs:p-6 text-sm xs:text-base">Loading... ⏳</div>;
  }

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 p-4 xs:p-6 ${theme === 'dark' ? 'bg-dark-gradient' : 'bg-light-gradient'}`}>
      <div className="card">
        <h2 className="text-xl xs:text-2xl font-bold mb-4 text-white p-3 xs:p-4 rounded-t-lg text-center">
          RSVP for {event?.name} 🎫
        </h2>
        {errors.fetch && <p className="text-red-600 mb-4 text-center text-sm xs:text-base">{errors.fetch}</p>}
        {errors.deadline && <p className="text-red-600 mb-4 text-center text-sm xs:text-base">{errors.deadline}</p>}
        {errors.capacity && <p className="text-red-600 mb-4 text-center text-sm xs:text-base">{errors.capacity}</p>}
        {errors.rsvp && <p className="text-red-600 mb-4 text-center text-sm xs:text-base">{errors.rsvp}</p>}
        {errors.payment && <p className="text-red-600 mb-4 text-center text-sm xs:text-base">{errors.payment}</p>}
        {event && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium text-gray-800 dark:text-white text-sm xs:text-base">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-sm xs:text-base"
              >
                <option value="Attending">Attending ✅</option>
                <option value="Not Attending">Not Attending ❌</option>
                <option value="Maybe">Maybe ❓</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-gray-800 dark:text-white text-sm xs:text-base">Comments</label>
              <textarea
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-sm xs:text-base"
                rows="4"
                placeholder="Any special requests? 📝"
              />
            </div>
            <button type="submit" className="btn-primary" disabled={Object.keys(errors).length > 0}>
              Submit RSVP 🚀
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default RSVPForm;