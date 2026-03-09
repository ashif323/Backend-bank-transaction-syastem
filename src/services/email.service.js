require("dotenv").config();
const nodemailer = require("nodemailer");

/*
SMTP configuration
Using explicit SMTP instead of service:gmail
This avoids IPv6 connection issues on Render
*/

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // Gmail App Password
  },
  tls: {
    rejectUnauthorized: false
  }
});


// Verify email connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email server connection failed:", error);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});


// Generic send email function
const sendEmail = async (to, subject, text, html) => {
  try {

    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    });

    console.log("📧 Email sent:", info.messageId);

  } catch (error) {
    console.error("❌ Error sending email:", error.message);
  }
};



// ===============================
// Registration Email
// ===============================

async function sendRegistrationEmail(userEmail, name) {

  const subject = `🎉 Welcome to Backend Ledger, ${name}!`;

  const text = `
Hello ${name},

Welcome to Backend Ledger!

Your account has been successfully created.

You can now start managing your transactions and financial records.

Best Regards,
Backend Ledger Team
`;

  const html = `
<div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
  <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:8px">

    <h2 style="color:#4CAF50;">Welcome to Backend Ledger 🎉</h2>

    <p>Hello <b>${name}</b>,</p>

    <p>Your account has been successfully created.</p>

    <ul>
      <li>📊 Track transactions</li>
      <li>💰 Manage finances</li>
      <li>📈 Monitor financial activity</li>
    </ul>

    <p>We are excited to have you on board.</p>

    <hr>

    <p style="font-size:13px;color:#777">
      If you did not create this account, please ignore this email.
    </p>

    <p><b>Backend Ledger Team</b></p>

  </div>
</div>
`;

  await sendEmail(userEmail, subject, text, html);
}



// ===============================
// Transaction Success Email
// ===============================

async function sendTransactionSuccessEmail(userEmail, name, amount, type, date) {

  const subject = "✅ Transaction Successful";

  const text = `
Hello ${name},

Your transaction was completed successfully.

Type: ${type}
Amount: ₹${amount}
Date: ${date}

Thank you for using Backend Ledger.
`;

  const html = `
<div style="font-family:Arial;background:#f4f6f8;padding:20px;">
  <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:8px">

    <h2 style="color:#28a745;">Transaction Successful</h2>

    <p>Hello <b>${name}</b>,</p>

    <table style="width:100%">
      <tr>
        <td><b>Type</b></td>
        <td>${type}</td>
      </tr>
      <tr>
        <td><b>Amount</b></td>
        <td>₹${amount}</td>
      </tr>
      <tr>
        <td><b>Date</b></td>
        <td>${date}</td>
      </tr>
    </table>

    <hr>

    <p>Thank you for using Backend Ledger.</p>

  </div>
</div>
`;

  await sendEmail(userEmail, subject, text, html);
}



// ===============================
// Transaction Failure Email
// ===============================

async function sendTransactionFailureEmail(userEmail, name, amount, type, reason) {

  const subject = "❌ Transaction Failed";

  const text = `
Hello ${name},

Your transaction failed.

Type: ${type}
Amount: ₹${amount}

Reason:
${reason}

Please try again later.
`;

  const html = `
<div style="font-family:Arial;background:#f4f6f8;padding:20px;">
  <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:8px">

    <h2 style="color:#dc3545;">Transaction Failed</h2>

    <p>Hello <b>${name}</b>,</p>

    <table style="width:100%">
      <tr>
        <td><b>Type</b></td>
        <td>${type}</td>
      </tr>
      <tr>
        <td><b>Amount</b></td>
        <td>₹${amount}</td>
      </tr>
      <tr>
        <td><b>Reason</b></td>
        <td>${reason}</td>
      </tr>
    </table>

    <hr>

    <p>Please contact support if the issue persists.</p>

  </div>
</div>
`;

  await sendEmail(userEmail, subject, text, html);
}



// Export functions

module.exports = {
  sendRegistrationEmail,
  sendTransactionSuccessEmail,
  sendTransactionFailureEmail
};