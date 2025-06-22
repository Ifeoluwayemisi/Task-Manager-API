import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL.USER,
        pass: process.env.EMAIL.PASS,
    },
});

const sendEmail = async (to, subject, text) => {
    await transporter.sendEmail({
        from: `"Chelle Task Manager" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
    });
};

export default sendEmail