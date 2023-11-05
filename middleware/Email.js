const nodemailer = require("nodemailer");

// VERIFY EMAIL

const Email = (options) => {
  let transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    type: process.env.SMTP,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
      return;
    }
  });
};

// SEND EMAIL
const EmailSender = ({ name, email, subject, message }) => {
  const options = {
    from: `🛍️ User from Dan's Store`,
    to: process.env.EMAIL_SENDER,
    subject: "Message from Dan's Store",
    html: `
        <div style="width: 100%; background-color: #f3f9ff; padding: 5rem 0">
        <div style="max-width: 700px; background-color: white; margin: 0 auto">
          <div style="width: 100%; padding: 20px 0; background-color: black">
          <a href="${process.env.CLIENT_URL}"><img
              src="https://res.cloudinary.com/dfaejacdn/image/upload/v1667615733/Dan-Logo/logoLight-Didan_zam0dg.png"
              style="width: 100%; height: 70px; object-fit: contain"
            /></a>

          </div>
          <div style="width: 100%; gap: 10px; padding: 30px 0; display: grid">
            <h2 style="font-weight: 800; font-size: 1.5rem; padding: 0 30px">
              Lời nhắn từ Dan Store
            </h2>
            <div style="font-size: .8rem; margin: 0 30px">
              <p>Tên đầy đủ: <b>${name}</b></p>
              <p>Email: <b>${email}</b></p>
              <p>Tiêu đề: <b>${subject}</b></p>
              <p>Nội dung: <i>${message}</i></p>
            </div>
          </div>
        </div>
      </div>
        `,
  };
  Email(options);
};

module.exports = EmailSender;
