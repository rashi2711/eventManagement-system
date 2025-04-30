const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  password: { type: String },
  role: { type: String, enum: ['Student', 'Faculty', 'StudentAdmin'], default: 'Student' },
  purpose: { type: String, enum: ['signup', 'reset-password'], required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // 10 minutes
});

// Hash password only, not OTP
otpSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare plain OTP
otpSchema.methods.matchOTP = async function (enteredOTP) {
  return enteredOTP.toString() === this.otp;
};

module.exports = mongoose.model('OTP', otpSchema);