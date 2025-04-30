const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  signup,
  verifyOTP,
  login,
  getProfile,
  updateProfile,
  changePassword,
  resetPassword,
  verifyResetOTP,
} = require('../controllers/authController');

router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/change-password', protect, changePassword);
router.post('/reset-password', resetPassword);
router.post('/verify-reset-otp', verifyResetOTP);

module.exports = router;