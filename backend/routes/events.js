const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
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
} = require('../controllers/eventController');

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post('/', protect, upload.single('image'), createEvent);
router.post('/rsvps/:eventId', protect, createRSVP);
router.get('/rsvps/:eventId', protect, getRSVPs);
router.get('/rsvps/user', protect, getUserRSVPs);
router.post('/payments/create-order/:eventId', protect, createOrder);
router.post('/payments/verify-payment', protect, verifyPayment);
router.get('/payments/:eventId', protect, getPayments);
router.get('/sections', getSections);
router.get('/subsections/:sectionId', getSubsections);

module.exports = router;