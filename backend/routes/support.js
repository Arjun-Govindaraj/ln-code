const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// POST /api/support/contact
router.post('/contact', async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: 'Please fill in both email and message fields.' });
  }

  try {
    // Configure Transporter (Using Gmail SMTP)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'erenyeager.18021802@gmail.com',
        // Paste your generated Google App Password here (Not your standard Gmail password)
        pass: process.env.EMAIL_APP_PASSWORD || 'nffy peoq ogum tppy'
      }
    });

    const mailOptions = {
      from: email,
      to: 'erenyeager.18021802@gmail.com',
      subject: `📩 New Ln Code Support Query from ${email}`,
      html: `
        <h3>New Support Message from Ln Code</h3>
        <p><strong>From:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p style="background: #f1f5f9; padding: 15px; border-radius: 8px;">${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Email sending error:', err);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

module.exports = router;