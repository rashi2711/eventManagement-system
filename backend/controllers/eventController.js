const cloudinary = require('cloudinary').v2;
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Event = require('../models/Event');
const Section = require('../models/Section');
const Subsection = require('../models/Subsection');
const RSVP = require('../models/RSVP');
const Payment = require('../models/Payment');
const Review = require('../models/Review');

let razorpay;
try {
  if (!process.env.RAZORPAY_KEY || !process.env.RAZORPAY_SECRET) {
    throw new Error('Razorpay credentials are missing');
  }
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
  });
} catch (error) {
  console.error('Razorpay initialization error:', error.message);
  razorpay = null;
}

// ... rest of the file remains unchanged ...

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('section', 'name')
      .populate('subsection', 'name')
      .populate('createdBy', 'firstName lastName');
    res.json(events);
  } catch (error) {
    console.error('Get all events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('section', 'name')
      .populate('subsection', 'name')
      .populate('createdBy', 'firstName lastName');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createEvent = async (req, res) => {
  const { name, description, date, time, location, section, subsection, price, capacity, status } = req.body;
  try {
    if (!name || !date || !time || !section || !subsection || !capacity) {
      return res.status(400).json({ message: 'Name, date, time, section, subsection, and capacity are required' });
    }

    const capacityNum = parseInt(capacity);
    if (isNaN(capacityNum) || capacityNum < 1) {
      return res.status(400).json({ message: 'Capacity must be a positive number' });
    }
    const priceNum = price ? parseFloat(price) : 0;
    if (price && (isNaN(priceNum) || priceNum < 0)) {
      return res.status(400).json({ message: 'Price must be a non-negative number' });
    }

    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    if (!['Faculty', 'StudentAdmin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only Faculty or StudentAdmin can create events' });
    }

    let sectionDoc = await Section.findOne({ name: section.trim() });
    if (!sectionDoc) {
      sectionDoc = await Section.create({ name: section.trim() });
    }

    let subsectionDoc = await Subsection.findOne({ name: subsection.trim(), section: sectionDoc._id });
    if (!subsectionDoc) {
      subsectionDoc = await Subsection.create({ name: subsection.trim(), section: sectionDoc._id });
    }

    let imageUrl = '';
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'events' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    const event = await Event.create({
      name: name.trim(),
      description: description ? description.trim() : '',
      date: eventDate,
      time: time.trim(),
      location: location ? location.trim() : '',
      section: sectionDoc._id,
      subsection: subsectionDoc._id,
      price: priceNum,
      capacity: capacityNum,
      availableSeats: capacityNum,
      status: status || 'pending',
      image: imageUrl,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(400).json({ message: error.message || 'Failed to create event' });
  }
};

const createRSVP = async (req, res) => {
  try {
    if (req.user.role !== 'Student') {
      return res.status(403).json({ message: 'Only students can RSVP' });
    }

    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.availableSeats <= 0) {
      return res.status(400).json({ message: 'No seats available' });
    }

    const existingRSVP = await RSVP.findOne({ event: event._id, user: req.user._id });
    if (existingRSVP) {
      return res.status(400).json({ message: 'You have already RSVP\'d for this event' });
    }

    const rsvp = await RSVP.create({
      event: event._id,
      user: req.user._id,
      paymentStatus: event.price > 0 ? 'Pending' : 'Completed',
    });

    event.availableSeats -= 1;
    await event.save();

    res.status(201).json({ message: 'RSVP created successfully', rsvp });
  } catch (error) {
    console.error('Create RSVP error:', error);
    res.status(400).json({ message: error.message || 'Failed to create RSVP' });
  }
};

const getRSVPs = async (req, res) => {
  try {
    if (!['Faculty', 'StudentAdmin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only Faculty or StudentAdmin can view RSVPs' });
    }

    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const rsvps = await RSVP.find({ event: req.params.eventId })
      .populate('user', 'firstName lastName email');
    
    res.json({
      total: rsvps.length,
      attendees: rsvps,
    });
  } catch (error) {
    console.error('Get RSVPs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserRSVPs = async (req, res) => {
  try {
    if (req.user.role !== 'Student') {
      return res.status(403).json({ message: 'Only students can view their RSVPs' });
    }

    const rsvps = await RSVP.find({ user: req.user._id })
      .populate('event', 'name date')
      .populate('user', 'firstName lastName email');
    
    res.json(rsvps);
  } catch (error) {
    console.error('Get user RSVPs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createOrder = async (req, res) => {
  if (!razorpay) {
    return res.status(503).json({ message: 'Payment gateway unavailable: Razorpay not initialized' });
  }

  try {
    if (req.user.role !== 'Student') {
      return res.status(403).json({ message: 'Only students can make payments' });
    }

    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.price <= 0) {
      return res.status(400).json({ message: 'This event is free' });
    }

    const rsvp = await RSVP.findOne({ event: event._id, user: req.user._id });
    if (!rsvp || rsvp.paymentStatus !== 'Pending') {
      return res.status(400).json({ message: 'No pending RSVP found for payment' });
    }

    const order = await razorpay.orders.create({
      amount: event.price * 100,
      currency: 'INR',
      receipt: `event_${event._id}_${req.user._id}`,
    });

    const payment = await Payment.create({
      event: event._id,
      user: req.user._id,
      amount: event.price,
      status: 'Pending',
      razorpayOrderId: order.id,
    });

    res.json({
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyPayment = async (req, res) => {
  if (!razorpay) {
    return res.status(503).json({ message: 'Payment gateway unavailable: Razorpay not initialized' });
  }

  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const payment = await Payment.findOne({ razorpayOrderId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.status = 'Completed';
    await payment.save();

    const rsvp = await RSVP.findOne({ event: payment.event, user: payment.user });
    if (rsvp) {
      rsvp.paymentStatus = 'Completed';
      await rsvp.save();
    }

    res.json({ message: 'Payment verified successfully' });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPayments = async (req, res) => {
  try {
    if (!['Faculty', 'StudentAdmin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only Faculty or StudentAdmin can view payments' });
    }

    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const payments = await Payment.find({ event: req.params.eventId, status: 'Completed' })
      .populate('user', 'firstName lastName email');

    res.json({
      total: payments.length,
      totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
      payments,
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSections = async (req, res) => {
  try {
    const sections = await Section.find();
    res.json(sections);
  } catch (error) {
    console.error('Get sections error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSubsections = async (req, res) => {
  try {
    const subsections = await Subsection.find({ section: req.params.sectionId });
    res.json(subsections);
  } catch (error) {
    console.error('Get subsections error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  createRSVP,
  getRSVPs,
  getUserRSVPs,
  createOrder,
  verifyPayment,
  getPayments,
  getSections,
  getSubsections,
};