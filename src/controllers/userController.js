const responseHandler = require("../helpers/responseHandler");
const { sendOtp } = require("../helpers/sendOtp");
const User = require("../models/userModel");
const { generateOTP } = require("../utils/generateOTP");
const { generateToken } = require("../utils/generateToken");

/* The `exports.sendOtp` function is responsible for sending an OTP (One Time Password) to a user's
mobile number for verification purposes. Here is a breakdown of what the function is doing: */
exports.sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) {
      return responseHandler(res, 400, "Mobile is required");
    }
    const user = await User.findOne({ mobile });
    if (!user) {
      return responseHandler(res, 404, "User not found");
    }
    const otp = generateOTP(5);
    const sendOtpFn = await sendOtp(mobile, otp);
    if (sendOtpFn.status == "failure") {
      return responseHandler(res, 400, "OTP sent failed");
    } else {
      user.otp = otp;
      await user.save();
      return responseHandler(res, 200, "OTP sent successfully");
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The `exports.verifyUser` function is responsible for verifying a user based on the OTP (One Time
Password) provided by the user. Here is a breakdown of what the function is doing: */
exports.verifyUser = async (req, res) => {
  try {
    const { otp, mobile } = req.body;
    if (!otp) {
      return responseHandler(res, 400, "OTP is required");
    }
    if (!mobile) {
      return responseHandler(res, 400, "Mobile is required");
    }
    const user = await User.findOne({ mobile });
    if (!user) {
      return responseHandler(res, 404, "User not found");
    }
    if (user.otp !== otp) {
      return responseHandler(res, 400, "Invalid OTP");
    }
    user.otp = null;
    user.isVerified = true;
    user.status = true;
    await user.save();

    const token = generateToken(user._id, user.userType);

    return responseHandler(res, 200, "User verified successfully", token);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The `exports.mpinHandler` function is responsible for handling the addition or update of an MPIN
(Mobile Personal Identification Number) for a user. Here is a breakdown of what the function is
doing: */
exports.mpinHandler = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);
    if (!user) {
      return responseHandler(res, 404, "User not found");
    }
    const updateUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    if (updateUser) {
      return responseHandler(
        res,
        200,
        `User mpin added successfully..!`,
        updateUser
      );
    } else {
      return responseHandler(res, 400, `User mpin failed...!`);
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};
