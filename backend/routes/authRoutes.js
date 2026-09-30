const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secretKey',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, username: user.username, email: user.email, isAdmin: user.isAdmin } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update Username
router.put('/update-profile', auth, async (req, res) => {
  const { username } = req.body;
  try {
    if (!username || !username.trim()) {
      return res.status(400).json({ msg: 'Username cannot be empty' });
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username: username.trim() },
      { new: true }
    ).select('-password');

    res.json({ msg: 'Profile updated successfully!', user });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Change Password
router.put('/change-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Incorrect current password' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ msg: 'New password must be at least 6 characters' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ msg: 'Password updated successfully!' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Reset Account Progress
router.post('/reset-account', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    user.quizHistory = [];
    user.streak = 0;
    user.lastActiveDate = '';
    user.badges = [];
    user.completedLanguages = [];
    user.bookmarks = [];

    await user.save();
    res.json({ msg: 'Account progress has been reset successfully!' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;