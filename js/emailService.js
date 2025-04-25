const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rameshdevalla144@gmail.com', // Replace with your email
    pass: 'lvimcpyyschqovdf' // Replace with your app password
  }
});

function sendAppointmentConfirmation(appointmentDetails) {
  const mailOptions = {
    from: 'rameshdevalla144@gmail.com',
    to: appointmentDetails.patientEmail,
    subject: 'Appointment Confirmation',
    html: `
      <h2>Appointment Confirmation</h2>
      <p>Dear Patient,</p>
      <p>Your appointment has been successfully booked:</p>
      <ul>
        <li>Booking ID: ${appointmentDetails.transactionId}</li>
        <li>Doctor: ${appointmentDetails.doctorName}</li>
        <li>Date: ${appointmentDetails.date}</li>
        <li>Time: ${appointmentDetails.slot}</li>
      </ul>
      <p>Please be available 5 minutes before your scheduled time.</p>
    `
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendAppointmentConfirmation };
