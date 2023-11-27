import nodemailer from "nodemailer";
import { env } from "../config/environment.js";

// VERIFY EMAIL

const sendMailTemplate = (options) => {
  let transporter = nodemailer.createTransport({
    service: env.EMAIL_SERVICE,
    type: env.SMTP_TYPE,
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    auth: {
      user: env.EMAIL_USERNAME,
      pass: env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log("Error occurred. " + err.message);
      return;
    }
  });
};

const sendConfirmMail = ({ email, message }) => {
  const linkRequest = `http://localhost:3000/active_account/?email=${email}&token=${message}`;
  const options = {
    from: `🛍️ Sport Shoe Shop`,
    to: email,
    subject: "Kích hoạt tài khoản",
    html: `
    <div
        class="preheader"
        style="
        display: none;
        max-width: 0;
        max-height: 0;
        overflow: hidden;
        font-size: 1px;
        line-height: 1px;
        color: #fff;
        opacity: 0;
      "
>
    A preheader is the short summary text that follows the subject line when
    an email is viewed in the inbox.
</div>
<!-- end preheader -->

<!-- start body -->
<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <!-- start logo -->
    <tr>
        <td align="center" bgcolor="#e9ecef">
            <!--[if (gte mso 9)|(IE)]>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                    <td align="center" valign="top" width="600">
            <![endif]-->
            <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    width="100%"
                    style="max-width: 600px"
            >
                <tr>
                    <td align="center" valign="top" style="padding: 36px 24px">
                        <a
                                href="https://www.blogdesire.com"
                                target="_blank"
                                style="display: inline-block"
                        >
                            <img
                                    src="https://www.blogdesire.com/wp-content/uploads/2019/07/blogdesire-1.png"
                                    alt="Logo"
                                    border="0"
                                    width="48"
                                    style="
                      display: block;
                      width: 48px;
                      max-width: 48px;
                      min-width: 48px;
                    "
                            />
                        </a>
                    </td>
                </tr>
            </table>
            <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
        </td>
    </tr>
    <!-- end logo -->

    <!-- start hero -->
    <tr>
        <td align="center" bgcolor="#e9ecef">
            <!--[if (gte mso 9)|(IE)]>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                    <td align="center" valign="top" width="600">
            <![endif]-->
            <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    width="100%"
                    style="max-width: 600px"
            >
                <tr>
                    <td
                            align="left"
                            bgcolor="#ffffff"
                            style="
                  padding: 36px 24px 0;
                  font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                  border-top: 3px solid #d4dadf;
                "
                    >
                        <h1
                                style="
                    margin: 0;
                    font-size: 32px;
                    font-weight: 700;
                    letter-spacing: -1px;
                    line-height: 48px;
                  "
                        >
                            Confirm Your Email Address
                        </h1>
                    </td>
                </tr>
            </table>
            <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
        </td>
    </tr>
    <!-- end hero -->

    <!-- start copy block -->
    <tr>
        <td align="center" bgcolor="#e9ecef">
            <!--[if (gte mso 9)|(IE)]>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                    <td align="center" valign="top" width="600">
            <![endif]-->
            <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    width="100%"
                    style="max-width: 600px"
            >
                <!-- start copy -->
                <tr>
                    <td
                            align="left"
                            bgcolor="#ffffff"
                            style="
                  padding: 24px;
                  font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                  font-size: 16px;
                  line-height: 24px;
                "
                    >
                        <p style="margin: 0">
                            Tap the button below to confirm your email address. If you
                            didn't create an account with
                            <a href="https://blogdesire.com">Paste</a>, you can safely
                            delete this email.
                        </p>
                    </td>
                </tr>
                <!-- end copy -->

                <!-- start button -->
                <tr>
                    <td align="left" bgcolor="#ffffff">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td align="center" bgcolor="#ffffff" style="padding: 12px">
                                    <table border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td
                                                    align="center"
                                                    bgcolor="#1a82e2"
                                                    style="border-radius: 6px"
                                            >
                                                <a
                                                        href="${linkRequest}"
                                                        target="_blank"
                                                        style="
                                display: inline-block;
                                padding: 16px 36px;
                                font-family: 'Source Sans Pro', Helvetica, Arial,
                                  sans-serif;
                                font-size: 16px;
                                color: #ffffff;
                                text-decoration: none;
                                border-radius: 6px;
                              "
                                                >Do Something Sweet</a
                                                >
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <!-- end button -->

                <!-- start copy -->
                <tr>
                    <td
                            align="left"
                            bgcolor="#ffffff"
                            style="
                  padding: 24px;
                  font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                  font-size: 16px;
                  line-height: 24px;
                "
                    >
                        <p style="margin: 0">
                            If that doesn't work, copy and paste the following link in
                            your browser:
                        </p>
                        <p style="margin: 0">
                            <a href="https://blogdesire.com" target="_blank"
                            >https://blogdesire.com/xxx-xxx-xxxx</a
                            >
                        </p>
                    </td>
                </tr>
                <!-- end copy -->

                <!-- start copy -->
                <tr>
                    <td
                            align="left"
                            bgcolor="#ffffff"
                            style="
                  padding: 24px;
                  font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                  font-size: 16px;
                  line-height: 24px;
                  border-bottom: 3px solid #d4dadf;
                "
                    >
                        <p style="margin: 0">
                            Cheers,<br />
                            Paste
                        </p>
                    </td>
                </tr>
                <!-- end copy -->
            </table>
            <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
        </td>
    </tr>
    <!-- end copy block -->

    <!-- start footer -->
    <tr>
        <td align="center" bgcolor="#e9ecef" style="padding: 24px">
            <!--[if (gte mso 9)|(IE)]>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                    <td align="center" valign="top" width="600">
            <![endif]-->
            <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    width="100%"
                    style="max-width: 600px"
            >
                <!-- start permission -->
                <tr>
                    <td
                            align="center"
                            bgcolor="#e9ecef"
                            style="
                  padding: 12px 24px;
                  font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                  font-size: 14px;
                  line-height: 20px;
                  color: #666;
                "
                    >
                        <p style="margin: 0">
                            You received this email because we received a request for
                            [type_of_action] for your account. If you didn't request
                            [type_of_action] you can safely delete this email.
                        </p>
                    </td>
                </tr>
                <!-- end permission -->

                <!-- start unsubscribe -->
                <tr>
                    <td
                            align="center"
                            bgcolor="#e9ecef"
                            style="
                  padding: 12px 24px;
                  font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                  font-size: 14px;
                  line-height: 20px;
                  color: #666;
                "
                    >
                        <p style="margin: 0">
                            To stop receiving these emails, you can
                            <a href="https://www.blogdesire.com" target="_blank"
                            >unsubscribe</a
                            >
                            at any time.
                        </p>
                        <p style="margin: 0">
                            Paste 1234 S. Broadway St. City, State 12345
                        </p>
                    </td>
                </tr>
                <!-- end unsubscribe -->
            </table>
            <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
        </td>
    </tr>
    <!-- end footer -->
</table>
        `
  };
  sendMailTemplate(options);
};

// SEND EMAIL CONTACT
const sendContact = ({ name, email, subject, message }) => {
  const options = {
    from: `🛍️ User from Sport Shoe Shop`,
    to: env.EMAIL_SENDER,
    subject: "Message from Sport Shoe Shop",
    html: `
        <div style="width: 100%; background-color: #f3f9ff; padding: 5rem 0">
        <div style="max-width: 700px; background-color: white; margin: 0 auto">
          <div style="width: 100%; padding: 20px 0; background-color: black">
          <a href="${env.CLIENT_URL}"><img
              src="https://res.cloudinary.com/dfaejacdn/image/upload/v1667615733/Dan-Logo/logoLight-Didan_zam0dg.png"
              style="width: 100%; height: 70px; object-fit: contain"
            /></a>

          </div>
          <div style="width: 100%; gap: 10px; padding: 30px 0; display: grid">
            <h2 style="font-weight: 800; font-size: 1.5rem; padding: 0 30px">
              Lời nhắn từ Shoe Shop
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
        `
  };
  sendMailTemplate(options);
};

// SEND EMAIL CONTACT
const sendForgotPassword = ({ email, newPassword }) => {
  const options = {
    from: `🛍️ User from Sport Shoe Shop`,
    to: email,
    subject: "Forgot Password",
    html: `
          <div style="width: 100%; background-color: #f3f9ff; padding: 5rem 0">
          <div style="max-width: 700px; background-color: white; margin: 0 auto">
            <div style="width: 100%; padding: 20px 0; background-color: black">
            <a href="${env.CLIENT_URL}"><img
                src="https://res.cloudinary.com/dfaejacdn/image/upload/v1667615733/Dan-Logo/logoLight-Didan_zam0dg.png"
                style="width: 100%; height: 70px; object-fit: contain"
              /></a>
  
            </div>
            <div style="width: 100%; gap: 10px; padding: 30px 0; display: grid">
              <h2 style="font-weight: 800; font-size: 1.5rem; padding: 0 30px">
                Dưới đây là mật khẩu mới của bạn:
              </h2>
              <div style="font-size: .8rem; margin: 0 30px">
                <p>Mật khẩu mới: <b>${newPassword}</b></p>
              </div>
            </div>
          </div>
        </div>
          `
  };
  sendMailTemplate(options);
};
export const emailSender = { sendContact, sendConfirmMail, sendForgotPassword };
