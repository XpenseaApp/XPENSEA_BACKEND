require("dotenv").config();
const nodemailer = require("nodemailer");
const { NODE_MAIL, NODE_PASS } = process.env;

const sendMail = async (to, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: NODE_MAIL,
        pass: NODE_PASS,
      },
    });

    const mailOptions = {
      from: NODE_MAIL,
      to: to,
      subject: `Your OTP for Secure Login on Xpensea`,
      text: `To complete your login on Xpensea, please use the One-Time Password (OTP) provided below:\n
      Your OTP: ${otp}\n
      For your security, please do not share this code with anyone. If you did not request this login, please disregard this email or contact our support team immediately.\n
      Thank you for choosing Xpensea!\n
      Best regards,\n
      Xpensea\n
      info@xpensea.com\n
      xpensea.com`,
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          resolve({ status: "failure", error });
        } else {
          resolve({ status: "success", data: info.response });
        }
      });
    });
  } catch (error) {
    return { status: "failure", error };
  }
};

module.exports = sendMail;
