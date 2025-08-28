// app/api/send-notification/route.js
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { to, subject, text, html } = await req.json();

    if (!to || !subject || (!text && !html)) {
      return new Response("Missing required fields", { status: 400 });
    }

    // Configure transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // change to SMTP provider
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Neighbourhood Watch" <${process.env.GMAIL_EMAIL}>`,
      to, // comma-separated emails
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true, info }), {
      status: 200,
    });
  } catch (error) {
    console.error("Email send error:", error);
    return new Response("Failed to send email", { status: 500 });
  }
}
