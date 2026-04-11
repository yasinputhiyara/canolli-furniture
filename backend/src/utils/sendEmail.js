import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  // Using dummy values to prevent crashing if ENV isn't set up.
  // Real transporter would use standard credentials here.
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.mailtrap.io",
    port: process.env.EMAIL_PORT || 2525,
    auth: {
      user: process.env.EMAIL_USER || "test_user",
      pass: process.env.EMAIL_PASS || "test_pass",
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || "noreply@canolli.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${options.email}`);
  } catch (error) {
    console.log(`Failed to send email to ${options.email} (Check SMTP settings)`);
  }
};

export default sendEmail;
