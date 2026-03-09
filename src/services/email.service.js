require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS   // app password here
    }
});


// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});


// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail, name) {

    const subject = "🎉 Welcome to Backend Ledger, " + name + "!";

    const text = `
Hello ${name},

Welcome to Backend Ledger!

Your account has been successfully created. 
You can now start managing your transactions, track expenses, and organize your financial records easily.

If you did not create this account, please ignore this email.

Best Regards,
Backend Ledger Team
`;

    const html = `
    <div style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:20px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; padding:30px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
            
            <h2 style="color:#4CAF50;">Welcome to Backend Ledger 🎉</h2>

            <p>Hello <strong>${name}</strong>,</p>

            <p>
                Your account has been <b>successfully created</b>. We are excited to have you on board!
            </p>

            <p>
                Backend Ledger helps you:
            </p>

            <ul>
                <li>📊 Track income and expenses</li>
                <li>💰 Manage financial records</li>
                <li>📈 Monitor your financial growth</li>
            </ul>

            <p style="margin-top:20px;">
                Start exploring and take control of your finances today.
            </p>

            <hr style="margin:25px 0;">

            <p style="font-size:13px; color:#777;">
                If you did not create this account, please ignore this email.
            </p>

            <p style="font-size:14px;">
                Best Regards,<br>
                <b>Backend Ledger Team</b>
            </p>

        </div>
    </div>
    `;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionSuccessEmail(userEmail, name, amount, type, date) {

    const subject = "✅ Transaction Successful";

    const text = `
Hello ${name},

Your transaction was completed successfully.

Transaction Details:
Type: ${type}
Amount: ₹${amount}
Date: ${date}

Thank you for using Backend Ledger.

Best Regards,
Backend Ledger Team
`;

    const html = `
    <div style="font-family:Arial; background:#f4f6f8; padding:20px;">
        <div style="max-width:600px; margin:auto; background:white; padding:30px; border-radius:8px;">

            <h2 style="color:#28a745;">✅ Transaction Successful</h2>

            <p>Hello <b>${name}</b>,</p>

            <p>Your transaction has been successfully processed.</p>

            <table style="width:100%; border-collapse:collapse; margin-top:15px;">
                <tr>
                    <td><b>Transaction Type</b></td>
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

            <p style="margin-top:20px;">
                Thank you for using <b>Backend Ledger</b>.
            </p>

            <hr>

            <p style="font-size:13px; color:#777;">
                If you did not perform this transaction, please contact support immediately.
            </p>

        </div>
    </div>
    `;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, amount, type, reason) {

    const subject = "❌ Transaction Failed";

    const text = `
Hello ${name},

Your transaction could not be completed.

Transaction Details:
Type: ${type}
Amount: ₹${amount}

Reason:
${reason}

Please try again or contact support.

Best Regards,
Backend Ledger Team
`;

    const html = `
    <div style="font-family:Arial; background:#f4f6f8; padding:20px;">
        <div style="max-width:600px; margin:auto; background:white; padding:30px; border-radius:8px;">

            <h2 style="color:#dc3545;">❌ Transaction Failed</h2>

            <p>Hello <b>${name}</b>,</p>

            <p>Unfortunately, your transaction could not be completed.</p>

            <table style="width:100%; border-collapse:collapse; margin-top:15px;">
                <tr>
                    <td><b>Transaction Type</b></td>
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

            <p style="margin-top:20px;">
                Please try again or contact support if the issue persists.
            </p>

            <hr>

            <p style="font-size:13px; color:#777;">
                Backend Ledger Security Notification
            </p>

        </div>
    </div>
    `;

    await sendEmail(userEmail, subject, text, html);
}

module.exports = {
    sendRegistrationEmail,
    sendTransactionSuccessEmail,
    sendTransactionFailureEmail
};