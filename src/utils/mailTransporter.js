const nodemailer = require('nodemailer');
const path = require('path');
const { COMPANY_EMAIL } = require('./constants');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  name: 'eugenicspharma.in',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendForgetPasswordMail = async (receiverEmail, url) => {
  try {
    const data = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: receiverEmail,
      subject: 'Reset Password',
      attachments: [
        {
          filename: 'header.png',
          path: path.join(__dirname, '/images/header.png'),
          cid: 'header.png',
        },
        {
          filename: 'background.png',
          path: path.join(__dirname, '/images/background.png'),
          cid: 'background.png',
        },
      ],
      html: `<!DOCTYPE html>
      <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
      
      <head>
          <title></title>
          <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
          <meta content="width=device-width,initial-scale=1" name="viewport" />
          <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
          <style>
              * {
                  box-sizing: border-box
              }
      
              body {
                  margin: 0;
                  padding: 0
              }
      
              a[x-apple-data-detectors] {
                  color: inherit !important;
                  text-decoration: inherit !important
              }
      
              #MessageViewBody a {
                  color: inherit;
                  text-decoration: none
              }
      
              p {
                  line-height: inherit
              }
      
              .desktop_hide,
              .desktop_hide table {
                  mso-hide: all;
                  display: none;
                  max-height: 0;
                  overflow: hidden
              }
      
              @media (max-width:620px) {
                  .desktop_hide table.icons-inner {
                      display: inline-block !important
                  }
      
                  .icons-inner {
                      text-align: center
                  }
      
                  .icons-inner td {
                      margin: 0 auto
                  }
      
                  .row-content {
                      width: 100% !important
                  }
      
                  .column .border,
                  .mobile_hide {
                      display: none
                  }
      
                  table {
                      table-layout: fixed !important
                  }
      
                  .stack .column {
                      width: 100%;
                      display: block
                  }
      
                  .mobile_hide {
                      min-height: 0;
                      max-height: 0;
                      max-width: 0;
                      overflow: hidden;
                      font-size: 0
                  }
      
                  .desktop_hide,
                  .desktop_hide table {
                      display: table !important;
                      max-height: none !important
                  }
              }
          </style>
      </head>
      
      <body style="margin:0;background-color:#091548;padding:0;-webkit-text-size-adjust:none;text-size-adjust:none">
          <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
              style="mso-table-lspace:0;mso-table-rspace:0;background-color:#091548" width="100%">
              <tbody>
                  <tr>
                      <td>
                          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1"
                              role="presentation"
                              style="mso-table-lspace:0;mso-table-rspace:0;background-repeat:repeat;background-position:center top;background-color:#091548;background-image:url(cid:background.png)"
                              width="100%">
                              <tbody>
                                  <tr>
                                      <td>
                                          <table align="center" border="0" cellpadding="0" cellspacing="0"
                                              class="row-content stack" role="presentation"
                                              style="mso-table-lspace:0;mso-table-rspace:0;color:#000;width:600px"
                                              width="600">
                                              <tbody>
                                                  <tr>
                                                      <td class="column column-1"
                                                          style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;vertical-align:top;padding-right:10px;padding-left:10px;padding-top:5px;padding-bottom:15px;border-top:0;border-right:0;border-bottom:0;border-left:0"
                                                          width="100%">
                                                          <table border="0" cellpadding="0" cellspacing="0"
                                                              class="image_block" role="presentation"
                                                              style="mso-table-lspace:0;mso-table-rspace:0" width="100%">
                                                              <tr>
                                                                  <td
                                                                      style="width:100%;padding-right:0;padding-left:0;padding-top:8px">
                                                                      <div align="center" style="line-height:10px"><img
                                                                              alt="Main Image" src="cid:header.png"
                                                                              style="display:block;height:auto;border:0;width:232px;max-width:100%"
                                                                              title="Main Image" width="232" /></div>
                                                                  </td>
                                                              </tr>
                                                          </table>
                                                          <table border="0" cellpadding="0" cellspacing="0" class="text_block"
                                                              role="presentation"
                                                              style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"
                                                              width="100%">
                                                              <tr>
                                                                  <td style="padding-top:10px;padding-bottom:15px">
                                                                      <div style="font-family:sans-serif">
                                                                          <div class="txtTinyMce-wrapper"
                                                                              style="font-size:14px;mso-line-height-alt:16.8px;color:#fff;line-height:1.2;font-family:'Varela Round','Trebuchet MS',Helvetica,sans-serif">
                                                                              <p
                                                                                  style="margin:0;font-size:14px;text-align:center">
                                                                                  <span style="font-size:30px;">Reset Your
                                                                                      Password</span></p>
                                                                          </div>
                                                                      </div>
                                                                  </td>
                                                              </tr>
                                                          </table>
                                                          <table border="0" cellpadding="5" cellspacing="0" class="text_block"
                                                              role="presentation"
                                                              style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"
                                                              width="100%">
                                                              <tr>
                                                                  <td>
                                                                      <div style="font-family:sans-serif">
                                                                          <div class="txtTinyMce-wrapper"
                                                                              style="font-size:14px;mso-line-height-alt:21px;color:#fff;line-height:1.5;font-family:'Varela Round','Trebuchet MS',Helvetica,sans-serif">
                                                                              <p
                                                                                  style="margin:0;font-size:14px;text-align:center">
                                                                                  We received a request to reset your
                                                                                  password. Don’t worry,</p>
                                                                              <p
                                                                                  style="margin:0;font-size:14px;text-align:center">
                                                                                  we are here to help you.</p>
                                                                          </div>
                                                                      </div>
                                                                  </td>
                                                              </tr>
                                                          </table>
                                                          <table border="0" cellpadding="0" cellspacing="0"
                                                              class="button_block" role="presentation"
                                                              style="mso-table-lspace:0;mso-table-rspace:0" width="100%">
                                                              <tr>
                                                                  <td
                                                                      style="text-align:center;padding-top:20px;padding-right:15px;padding-bottom:20px;padding-left:15px">
                                                                      <div align="center">
                                                                          <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="http://www.example.com/" style="height:42px;width:218px;v-text-anchor:middle;" arcsize="58%" stroke="false" fillcolor="#ffffff"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#091548; font-family:'Trebuchet MS', sans-serif; font-size:15px"><![endif]-->
                                                                          <a href=${url}
                                                                              style="text-decoration:none;display:inline-block;color:#091548;background-color:#ffffff;border-radius:24px;width:auto;border-top:1px solid #ffffff;font-weight:undefined;border-right:1px solid #ffffff;border-bottom:1px solid #ffffff;border-left:1px solid #ffffff;padding-top:5px;padding-bottom:5px;font-family:'Varela Round', 'Trebuchet MS', Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;"
                                                                              target="_blank"><span
                                                                                  style="padding-left:25px;padding-right:25px;font-size:15px;display:inline-block;letter-spacing:normal;"><span
                                                                                      style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;"><span
                                                                                          data-mce-style="font-size: 15px; line-height: 30px;"
                                                                                          style="font-size: 15px; line-height: 30px;"><strong>RESET
                                                                                              MY
                                                                                              PASSWORD</strong></span></span></span></a>
                                                                          <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                                                      </div>
                                                                  </td>
                                                              </tr>
                                                          </table>
                                                          <table border="0" cellpadding="0" cellspacing="0"
                                                              class="divider_block" role="presentation"
                                                              style="mso-table-lspace:0;mso-table-rspace:0" width="100%">
                                                              <tr>
                                                                  <td
                                                                      style="padding-top:10px;padding-right:10px;padding-bottom:15px;padding-left:10px">
                                                                      <div align="center">
                                                                          <table border="0" cellpadding="0" cellspacing="0"
                                                                              role="presentation"
                                                                              style="mso-table-lspace:0;mso-table-rspace:0"
                                                                              width="60%">
                                                                              <tr>
                                                                                  <td class="divider_inner"
                                                                                      style="font-size:1px;line-height:1px;border-top:1px solid #5a6ba8">
                                                                                      <span> </span></td>
                                                                              </tr>
                                                                          </table>
                                                                      </div>
                                                                  </td>
                                                              </tr>
                                                          </table>
                                                          <table border="0" cellpadding="0" cellspacing="0" class="text_block"
                                                              role="presentation"
                                                              style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"
                                                              width="100%">
                                                              <tr>
                                                                  <td
                                                                      style="padding-top:10px;padding-right:25px;padding-bottom:40px;padding-left:25px">
                                                                      <div style="font-family:sans-serif">
                                                                          <div class="txtTinyMce-wrapper"
                                                                              style="font-size:14px;mso-line-height-alt:21px;color:#7f96ef;line-height:1.5;font-family:'Varela Round','Trebuchet MS',Helvetica,sans-serif">
                                                                              <p
                                                                                  style="margin:0;font-size:14px;text-align:center">
                                                                                  <strong>Didn’t request a password
                                                                                      reset?</strong></p>
                                                                              <p
                                                                                  style="margin:0;font-size:14px;text-align:center">
                                                                                  You can safely ignore this message.</p>
                                                                          </div>
                                                                      </div>
                                                                  </td>
                                                              </tr>
                                                          </table>
                                                      </td>
                                                  </tr>
                                              </tbody>
                                          </table>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2"
                              role="presentation" style="mso-table-lspace:0;mso-table-rspace:0" width="100%">
                              <tbody>
                                  <tr>
                                      <td>
                                          <table align="center" border="0" cellpadding="0" cellspacing="0"
                                              class="row-content stack" role="presentation"
                                              style="mso-table-lspace:0;mso-table-rspace:0;color:#000;width:600px"
                                              width="600">
                                              <tbody>
                                                  <tr>
                                                      <td class="column column-1"
                                                          style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;vertical-align:top;padding-right:10px;padding-left:10px;padding-top:15px;padding-bottom:15px;border-top:0;border-right:0;border-bottom:0;border-left:0"
                                                          width="100%">
                                                          <table border="0" cellpadding="5" cellspacing="0"
                                                              class="image_block" role="presentation"
                                                              style="mso-table-lspace:0;mso-table-rspace:0" width="100%">
                                                          </table>
                                                          <table border="0" cellpadding="0" cellspacing="0"
                                                              class="divider_block" role="presentation"
                                                              style="mso-table-lspace:0;mso-table-rspace:0" width="100%">
                                                              <tr>
                                                                  <td
                                                                      style="padding-top:15px;padding-right:10px;padding-bottom:15px;padding-left:10px">
                                                                      <div align="center">
                                                                          <table border="0" cellpadding="0" cellspacing="0"
                                                                              role="presentation"
                                                                              style="mso-table-lspace:0;mso-table-rspace:0"
                                                                              width="60%">
                                                                          </table>
                                                                      </div>
                                                                  </td>
                                                              </tr>
                                                          </table>
                                                          <table border="0" cellpadding="10" cellspacing="0"
                                                              class="social_block" role="presentation"
                                                              style="mso-table-lspace:0;mso-table-rspace:0" width="100%">
                                                              <tr>
                                                                  <td>
                                                                      <table align="center" border="0" cellpadding="0"
                                                                          cellspacing="0" class="social-table"
                                                                          role="presentation"
                                                                          style="mso-table-lspace:0;mso-table-rspace:0"
                                                                          width="156px">     
                                                                      </table>
                                                                  </td>
                                                              </tr>
                                                          </table>
                                                          <table border="0" cellpadding="15" cellspacing="0"
                                                              class="text_block" role="presentation"
                                                              style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"
                                                              width="100%">
                                                              <tr>
                                                                  <td>
                                                                      <div style="font-family:sans-serif">
                                                                          <div class="txtTinyMce-wrapper"
                                                                              style="font-size:12px;font-family:'Varela Round','Trebuchet MS',Helvetica,sans-serif;mso-line-height-alt:14.399999999999999px;color:#4a60bb;line-height:1.2">
                                                                              <p
                                                                                  style="margin:0;font-size:12px;text-align:center">
                                                                                  <span style="">Copyright © 2022 Eugenics,
                                                                                      All rights reserved.<br /><br />Where to
                                                                                      find us: <a  style="text-decoration: underline; color: #7f96ef;" href="https://eugenicspharma.in">eugenicspharma.in</a></span></p>
                                                              
                                                                          </div>
                                                                      </div>
                                                                  </td>
                                                              </tr>
                                                          </table>
                                                          <table border="0" cellpadding="0" cellspacing="0" class="html_block"
                                                              role="presentation"
                                                              style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word;word-wrap:break-word"
                                                              width="100%">
                                                              <tr>
                                                                  <td>
                                                                      <div align="center"
                                                                          style="font-family:'Varela Round','Trebuchet MS',Helvetica,sans-serif;text-align:center">
                                                                          <div style="height-top: 20px;"> </div>
                                                                      </div>
                                                                  </td>
                                                              </tr>
                                                          </table>
                                                      </td>
                                                  </tr>
                                              </tbody>
                                          </table>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3"
                              role="presentation" style="mso-table-lspace:0;mso-table-rspace:0" width="100%">
                              <tbody>
                                  <tr>
                                      <td>
                                          <table align="center" border="0" cellpadding="0" cellspacing="0"
                                              class="row-content stack" role="presentation"
                                              style="mso-table-lspace:0;mso-table-rspace:0;color:#000;width:600px"
                                              width="600">
                                              <tbody>
                                                  <tr>
                                                      <td class="column column-1"
                                                          style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;vertical-align:top;padding-top:5px;padding-bottom:5px;border-top:0;border-right:0;border-bottom:0;border-left:0"
                                                          width="100%">
                                                          <table border="0" cellpadding="0" cellspacing="0"
                                                              class="icons_block" role="presentation"
                                                              style="mso-table-lspace:0;mso-table-rspace:0" width="100%">
                                                              <tr>
                                                                  <td
                                                                      style="vertical-align:middle;color:#9d9d9d;font-family:inherit;font-size:15px;padding-bottom:5px;padding-top:5px;text-align:center">
                                                                      <table cellpadding="0" cellspacing="0"
                                                                          role="presentation"
                                                                          style="mso-table-lspace:0;mso-table-rspace:0"
                                                                          width="100%">
                                                                          <tr>
                                                                              <td
                                                                                  style="vertical-align:middle;text-align:center">
                                                                                  <!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                                                                                  <!--[if !vml]><!-->
                                                                                  <table cellpadding="0" cellspacing="0"
                                                                                      class="icons-inner" role="presentation"
                                                                                      style="mso-table-lspace:0;mso-table-rspace:0;display:inline-block;margin-right:-4px;padding-left:0;padding-right:0">
                                                                                      <!--<![endif]-->
                                                                                     
                                                                                  </table>
                                                                              </td>
                                                                          </tr>
                                                                      </table>
                                                                  </td>
                                                              </tr>
                                                          </table>
                                                      </td>
                                                  </tr>
                                              </tbody>
                                          </table>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                      </td>
                  </tr>
              </tbody>
          </table><!-- End -->
      </body>
      
      </html>`,
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
      from: email,
      to: COMPANY_EMAIL,
      subject: `MAIL FROM WEBSITE ${subject}`,
      attachments: [],
      html: `Name: ${name} <br> Phone: ${phoneNumber} <br> ${message}`,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { sendForgetPasswordMail, sendContactUsMail };
