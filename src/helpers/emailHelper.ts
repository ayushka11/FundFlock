import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configure Nodemailer transporter for Outlook
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false, // Use `false` for TLS (587)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to send an email
export async function sendEmail(to: string, subject: string, text: string) {
    try {
        await transporter.sendMail({
            from: `"FundFlock" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
        });
        console.log(`✅ Email sent to ${to}`);
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
}
