const RSVP = require('../models/RSVP');
const Event = require('../models/Event');

const createRSVP = async (req, res) => {
  try {
    const { comments } = req.body;
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const eventDateTime = new Date(`${event.date.toISOString().split('T')[0]}T${event.time}:00`);
    if (eventDateTime < new Date()) {
      return res.status(400).json({ message: 'Event deadline has passed' });
    }
    if (event.availableSeats <= 0) {
      return res.status(400).json({ message: 'No seats available' });
    }
    const existingRSVP = await RSVP.findOne({ user: req.user._id, event: event._id });
    if (existingRSVP) {
      return res.status(400).json({ message: 'Already RSVP\'d' });
    }
    const rsvp = await RSVP.create({
      user: req.user._id,
      event: event._id,
      paymentStatus: event.price > 0 ? 'Pending' : 'Completed',
      comments,
    });
    if (event.price === 0) {
      event.availableSeats -= 1;
      await event.save();
    }
    res.status(201).json({ rsvpId: rsvp._id });
  } catch (error) {
    console.error('Create RSVP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserRSVPs = async (req, res) => {
  try {
    const rsvps = await RSVP.find({ user: req.user._id })
      .populate('event', 'name date time location')
      .populate('user', 'firstName lastName');
    res.json(rsvps);
  } catch (error) {
    console.error('Get user RSVPs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getEventRSVPs = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (req.user.role !== 'Faculty' || event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const rsvps = await RSVP.find({ event: event._id })
      .populate('user', 'firstName lastName email')
      .select('user paymentStatus comments createdAt');
    const totalRSVPs = rsvps.length;
    const attendees = rsvps.filter(rsvp => rsvp.paymentStatus === 'Completed').length;
    res.json({
      totalRSVPs,
      attendees,
      rsvps,
    });
  } catch (error) {
    console.error('Get event RSVPs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createRSVP,
  getUserRSVPs,
  getEventRSVPs,
};