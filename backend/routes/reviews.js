const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createReview, getEventReviews, deleteReview } = require('../controllers/reviewController');

router.post('/:eventId', protect, createReview);
router.get('/:eventId', getEventReviews);
router.delete('/:reviewId', protect, deleteReview);

module.exports = router;