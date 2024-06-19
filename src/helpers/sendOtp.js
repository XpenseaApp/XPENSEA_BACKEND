const axios = require("axios");
const qs = require('querystring');

exports.sendOtp = async (mobile, otp) => {
  try {
    const sender = "Xpensea";
    const message = `Hi user , ${otp} is your OTP to login to Xpensea APP`
    const postData = {
      'apikey': process.env.TEXT_LOCAL_API_KEY,
      'numbers': mobile,
      'sender': encodeURIComponent(sender),
      'message': encodeURIComponent(message),
    };
    const response = await axios.post('https://api.textlocal.in/send/', qs.stringify(postData));
    return response.data;
  } catch (error) {
    console.log("🚀 ~ exports.sendOtp= ~ error:", error.message)
  }
};
