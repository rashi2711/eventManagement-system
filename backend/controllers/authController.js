const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');
const OTP = require('../models/OTP');
const mailSender = require('../utils/mailSender');
const emailVerificationTemplate = require('../mail/templates/emailVerificationTemplate');
const resetPasswordTemplate = require('../mail/templates/resetPasswordTemplate');

const signup = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  try {
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }
    if (!['Student', 'Faculty', 'StudentAdmin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const otpExists = await OTP.findOne({ email });
    if (otpExists) {
      await OTP.deleteOne({ email });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Generated OTP for ${email}: ${otp}`);
    await OTP.create({
      email,
      otp,
      firstName,
      lastName,
      password,
      role: role || 'Student',
      purpose: 'signup',
    });

    await mailSender(
      email,
      'Email Verification',
      emailVerificationTemplate(otp, firstName)
    );

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const otpRecord = await OTP.findOne({ email, purpose: 'signup' });
    console.log(`OTP record for ${email}:`, otpRecord);
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const isMatch = await otpRecord.matchOTP(otp);
    console.log(`OTP match for ${email}: ${isMatch}`);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const user = await User.create({
      firstName: otpRecord.firstName,
      lastName: otpRecord.lastName,
      email: otpRecord.email,
      password: otpRecord.password,
      role: otpRecord.role,
      isVerified: true,
      approved: otpRecord.role === 'Student',
    });

    const avatarUrl = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(email)}&backgroundColor=2563eb`;

    await Profile.create({
      userId: user._id,
      image: avatarUrl,
      designation: '',
      department: '',
    });

    await OTP.deleteOne({ email, purpose: 'signup' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        approved: user.approved,
        image: avatarUrl,
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login failed: User not found for email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log('Login failed: Incorrect password for email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Account not verified' });
    }
    if (!user.approved) {
      return res.status(403).json({ message: 'Account not approved' });
    }

    const profile = await Profile.findOne({ userId: user._id });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        approved: user.approved,
        image: profile ? profile.image : null,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const profile = await Profile.findOne({ userId: req.user._id });
    res.json({ user, profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  const { firstName, lastName, image, designation, department } = req.body;
  try {
    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'First name and last name are required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName },
      { new: true }
    ).select('-password');

    const profileUpdate = { designation, department };
    if (image && image.startsWith('data:image')) {
      profileUpdate.image = image;
    } else if (!image || image === '') {
      profileUpdate.image = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.email)}&backgroundColor=2563eb`;
    }

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user._id },
      profileUpdate,
      { new: true, upsert: true }
    );

    res.json({
      user,
      profile,
      updatedUser: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        approved: user.approved,
        image: profile.image,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Old and new passwords are required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect old password' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otpExists = await OTP.findOne({ email, purpose: 'reset-password' });
    if (otpExists) {
      await OTP.deleteOne({ email, purpose: 'reset-password' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Generated reset OTP for ${email}: ${otp}`);
    await OTP.create({
      email,
      otp,
      purpose: 'reset-password',
    });

    await mailSender(
      email,
      'Password Reset OTP',
      resetPasswordTemplate(otp, user.firstName)
    );

    res.status(200).json({ message: 'Reset OTP sent to email' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const verifyResetOTP = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' });
    }

    const otpRecord = await OTP.findOne({ email, purpose: 'reset-password' });
    console.log(`Reset OTP record for ${email}:`, otpRecord);
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const isMatch = await otpRecord.matchOTP(otp);
    console.log(`Reset OTP match for ${email}: ${isMatch}`);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    await OTP.deleteOne({ email, purpose: 'reset-password' });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Verify reset OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  signup,
  verifyOTP,
  login,
  getProfile,
  updateProfile,
  changePassword,
  resetPassword,
  verifyResetOTP,
};