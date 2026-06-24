const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  family: 4, 

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.error("VERIFY ERROR:", err);
  } else {
    console.log("SMTP READY");
  }
});

const sendEmail = async (to, subject, text) => {
  console.log("EMAIL_USER:", process.env.EMAIL_USER);

  console.log("BEFORE SENDMAIL");

  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });

  console.log("AFTER SENDMAIL");

  return info;
};

module.exports = sendEmail;