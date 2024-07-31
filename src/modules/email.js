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
    sendEmail = async (emailTo, subject, text) => {
        const options = {
            from: process.env.EMAIL_HOST_USER,
            to: emailTo,
            subject: subject,
            text: text,
        };

        transporter.sendMail(options, (error, info) => {
            if (error) throw error
            return info
        });
    }
}

const emailServices = new Email()

module.exports = emailServices