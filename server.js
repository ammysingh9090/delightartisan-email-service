import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json()); // For parsing application/json

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
});

app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, phone, message,service } = req.body;

    // Validate required fields
    if (!name || !email || !message || !service) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const info = await transporter.sendMail({
      from: `"Contact Form" <${process.env.MAIL_USERNAME}>`,
      to: process.env.MAIL_FROM_ADDRESS,
      subject: `New message from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Service:</strong> ${service}</p>

      `
    });
    
    res.status(200).json({ success: true, info }); // optionally return to client
    
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Using email: ${process.env.MAIL_USERNAME}`);
});