const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log("Email credentials not found, skipping email.");
            return;
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const message = {
            from: `${process.env.FROM_NAME || 'Task App'} <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html
        };

        const info = await transporter.sendMail(message);
        console.log(`Message sent: ${info.messageId}`);
    } catch (error) {
        console.error("Error sending email:", error);
        // Don't crash app on email fail
    }
};

module.exports = sendEmail;
