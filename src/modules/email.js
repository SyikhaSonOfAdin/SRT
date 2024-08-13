const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.PASSWORD,
    },
});

class Email {
    sendEmail = async (emailTo, subject, text, html) => {
        const options = {
            from: process.env.EMAIL_HOST_USER,
            to: emailTo,
            subject: subject,
            text: text,
            html: html
        };

        try {
            // Menggunakan Promise untuk menunggu hasil sendMail
            const info = await transporter.sendMail(options);
            return info;
        } catch (error) {
            // Jika terjadi error, melemparkannya kembali
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
}

const emailServices = new Email()

module.exports = { Email, emailServices }