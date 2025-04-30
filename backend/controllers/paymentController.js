const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Event = require('../models/Event');
const RSVP = require('../models/RSVP');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

const createOrder = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { rsvpId } = req.body;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const rsvp = await RSVP.findById(rsvpId);
    if (!rsvp || rsvp.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const options = {
      amount: event.price * 100, // In paise
      currency: 'INR',
      receipt: `receipt_${rsvpId}`,
    };
    const order = await razorpay.orders.create(options);
    res.json({
      key: process.env.RAZORPAY_KEY,
      amount: options.amount,
      currency: options.currency,
      razorpayOrderId: order.id,
    });
  } catch (error) {
    console.error('Create order error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, rsvpId } = req.body;
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(body)
      .digest('hex');
    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }
    const rsvp = await RSVP.findById(rsvpId);
    if (!rsvp) {
      return res.status(404).json({ message: 'RSVP not found' });
    }
    await Payment.create({
      user: rsvp.user,
      event: rsvp.event,
      rsvp: rsvpId,
      amount: rsvp.event.price,
      razorpayOrderId,
      razorpayPaymentId,
      status: 'Completed',
    });
    rsvp.paymentStatus = 'Completed';
    await rsvp.save();
    const event = await Event.findById(rsvp.event);
    event.availableSeats -= 1;
    await event.save();
    res.json({ message: 'Payment verified' });
  } catch (error) {
    console.error('Verify payment error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPayments = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (
      req.user.role !== 'StudentAdmin' &&
      event.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const payments = await Payment.find({ event: eventId })
      .populate('user', 'firstName lastName email')
      .select('user amount status createdAt razorpayPaymentId')
      .lean();
    const total = payments.length;
    const totalAmount = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    res.json({
      total,
      totalAmount,
      payments,
    });
  } catch (error) {
    console.error('Get payments error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserPayments = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const payments = await Payment.find({ user: req.user._id })
      .populate('event', 'name')
      .select('event amount status createdAt razorpayPaymentId')
      .lean();
    const total = payments.length;
    const totalAmount = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    res.json({
      total,
      totalAmount,
      payments: payments.map(payment => ({
        ...payment,
        event: payment.event || { name: 'Unknown Event' },
      })),
    });
  } catch (error) {
    console.error('Get user payments error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getPayments,
  getUserPayments,
};