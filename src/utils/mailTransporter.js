const nodemailer = require('nodemailer');
const path = require('path');
const { COMPANY_EMAIL } = require('./constants');

const MAIL_FROM_RECOVERY = 'recovery@eugenicspharma.in';
const MAIL_FROM_INFO = 'info@eugenicspharma.in';

const LOGO_CID = 'logo.jpg';
const logoAttachment = {
  filename: 'logo.jpg',
  path: path.join(__dirname, 'images/logo.jpg'),
  cid: LOGO_CID,
};

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const buildBrandedEmailHtml = ({ title, bodyParagraphs, ctaHref, ctaLabel, footerNote }) => {
  const bodyHtml = bodyParagraphs
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#111111;text-align:center;">${p}</p>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
  <meta content="width=device-width,initial-scale=1" name="viewport" />
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f4f4;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background-color:#ffffff;border:1px solid #e5e5e5;border-radius:4px;">
          <tr>
            <td align="center" style="padding:32px 32px 24px;">
              <img src="cid:${LOGO_CID}" alt="Eugenics" width="190" style="display:block;max-width:100%;height:auto;border:0;" />
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 32px 8px;font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:bold;color:#111111;">
              ${title}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 24px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 32px 32px;">
              <a href="${ctaHref}" target="_blank"
                style="display:inline-block;background-color:#c41230;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;text-decoration:none;padding:14px 32px;border-radius:4px;">
                ${ctaLabel}
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;color:#666666;text-align:center;">
              ${footerNote}
              <br/><br/>
              Copyright &copy; ${new Date().getFullYear()} Eugenics. All rights reserved.<br/>
              <a href="https://eugenicspharma.in" style="color:#c41230;text-decoration:none;">eugenicspharma.in</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const sendForgetPasswordMail = async (receiverEmail, url) => {
  try {
    await transporter.sendMail({
      from: MAIL_FROM_RECOVERY,
      to: receiverEmail,
      subject: 'Reset Password',
      attachments: [logoAttachment],
      html: buildBrandedEmailHtml({
        title: 'Reset Your Password',
        bodyParagraphs: [
          'We received a request to reset your password.',
          'Click the button below to choose a new password.',
        ],
        ctaHref: url,
        ctaLabel: 'RESET MY PASSWORD',
        footerNote:
          '<strong>Didn&rsquo;t request a password reset?</strong><br/>You can safely ignore this message.',
      }),
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const sendContactUsMail = async (
  name,
  email,
  phoneNumber,
  subject,
  message
) => {
  try {
    await transporter.sendMail({
      from: MAIL_FROM_INFO,
      replyTo: email,
      to: COMPANY_EMAIL,
      subject: `MAIL FROM WEBSITE ${subject}`,
      attachments: [],
      html: `Name: ${name} <br> Email: ${email} <br> Phone: ${phoneNumber} <br> ${message}`,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const sendInviteMail = async (receiverEmail, link) => {
  try {
    await transporter.sendMail({
      from: MAIL_FROM_INFO,
      to: receiverEmail,
      subject: 'You have been invited to Eugenics',
      attachments: [logoAttachment],
      html: buildBrandedEmailHtml({
        title: "You're Invited",
        bodyParagraphs: [
          'An admin has invited you to create your account on the Eugenics platform.',
          'Click the button below to set up your account. This link expires in 7 days.',
        ],
        ctaHref: link,
        ctaLabel: 'CREATE MY ACCOUNT',
        footerNote:
          'If you did not expect this invitation, you can safely ignore this email.',
      }),
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { sendForgetPasswordMail, sendContactUsMail, sendInviteMail };
