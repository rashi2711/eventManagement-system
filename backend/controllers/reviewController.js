const Review = require('../models/Review');
const Event = require('../models/Event');

const createReview = async (req, res) => {
  const { rating, comment } = req.body;
  try {
    if (req.user.role !== 'Student') {
      return res.status(403).json({ message: 'Only students can submit reviews' });
    }
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const existingReview = await Review.findOne({ user: req.user._id, event: event._id });
    if (existingReview) {
      return res.status(400).json({ message: 'Review already exists' });
    }
    const review = await Review.create({
      user: req.user._id,
      event: event._id,
      rating,
      comment,
    });
    const reviews = await Review.find({ event: event._id });
    event.averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    event.reviewCount = reviews.length;
    await event.save();
    res.status(201).json(review);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getEventReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ event: req.params.eventId })
      .populate('user', 'firstName lastName');
    res.json(reviews);
  } catch (error) {
    console.error('Get event reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await review.deleteOne();
    const reviews = await Review.find({ event: review.event });
    const event = await Event.findById(review.event);
    event.averageRating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
    event.reviewCount = reviews.length;
    backend/controllers/authController.js
    await event.save();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createReview,
  getEventReviews,
  deleteReview,
};