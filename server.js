const express = require('express');
const cors = require('cors');
const { sendAppointmentConfirmation } = require('./js/emailService');

const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

app.post('/api/sendAppointmentConfirmation', async (req, res) => {
  try {
    await sendAppointmentConfirmation(req.body);
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email',
      error: error.message 
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
