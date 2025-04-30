const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createRSVP, getUserRSVPs, getEventRSVPs } = require('../controllers/rsvpController');

router.post('/:eventId', protect, createRSVP);
router.get('/', protect, getUserRSVPs);
router.get('/event/:eventId', protect, getEventRSVPs); // New route for faculty

module.exports = router;