import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { createOrder, verifyPayment } from '../api';

const Payments = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { rsvpId } = location.state || {};

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!rsvpId) {
      setError('RSVP ID is required');
      return;
    }
    setIsLoading(true);
    try {
      const response = await createOrder(eventId, { rsvpId });
      const { razorpayOrderId, amount, currency, key } = response.data;

      const isRazorpayLoaded = await loadRazorpay();
      if (!isRazorpayLoaded) {
        setError('Failed to load payment gateway');
        setIsLoading(false);
        return;
      }

      const options = {
        key,
        amount,
        currency,
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
            await verifyPayment({
              razorpayOrderId: razorpay_order_id,
              razorpayPaymentId: razorpay_payment_id,
              razorpaySignature: razorpay_signature,
              rsvpId,
            });
            navigate('/payment-receipt', { state: { razorpayPaymentId: razorpay_payment_id } });
          } catch (err) {
            setError(err.response?.data?.message || 'Payment verification failed');
            console.error('Payment verification error:', err);
          }
        },
        prefill: {
          name: `${user?.firstName} ${user?.lastName}`,
          email: user?.email,
        },
        theme: { color: '#2563eb' },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
      console.error('Create order error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.role !== 'Student') {
    return (
      <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 p-4 xs:p-6 ${theme === 'dark' ? 'bg-dark-gradient' : 'bg-light-gradient'}`}>
        <p className="text-red-600 text-center">Only students can access this page</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 p-4 xs:p-6 ${theme === 'dark' ? 'bg-dark-gradient' : 'bg-light-gradient'}`}>
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 xs:p-8 rounded-lg shadow-lg">
        <h2 className="text-xl xs:text-2xl font-bold text-gray-800 dark:text-white mb-4 xs:mb-6 text-center">
          Event Payment 💳
        </h2>
        {error && <p className="text-red-600 mb-4 text-center text-sm xs:text-base">{error}</p>}
        <button
          onClick={handlePayment}
          disabled={isLoading}
          className={`w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm xs:text-base transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </div>
  );
};

export default Payments;