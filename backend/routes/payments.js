const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createOrder, verifyPayment, getPayments, getUserPayments } = require('../controllers/paymentController');

router.post('/create-order/:eventId', protect, createOrder);
router.post('/verify-payment', protect, verifyPayment);
router.get('/:eventId', protect, getPayments);
router.get('/user', protect, getUserPayments); // New

module.exports = router;