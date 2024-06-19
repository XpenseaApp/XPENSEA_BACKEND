const responseHandler = require("../helpers/responseHandler");
const { sendOtp } = require("../helpers/sendOtp");
const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const { hashPassword, comparePasswords } = require("../utils/bcrypt");
const { generateOTP } = require("../utils/generateOTP");
const { generateToken } = require("../utils/generateToken");
const { createExpenseSchema } = require("../validations");

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

    return responseHandler(res, 200, "User verified successfully");
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The `exports.mpinHandler` function is responsible for handling the MPIN (Mobile Personal
Identification Number) related operations for a user. Here is a breakdown of what the function is
doing: */
exports.mpinHandler = async (req, res) => {
  try {
    const { mobile, mpin } = req.body;

    if (!mobile) {
      return responseHandler(res, 400, "Mobile number is required");
    }
    if (!mpin) {
      return responseHandler(res, 400, "MPIN is required");
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      return responseHandler(res, 404, "User not found");
    }

    if (user.mpin) {
      const comparePassword = await comparePasswords(mpin, user.mpin);
      if (!comparePassword) {
        return responseHandler(res, 401, "Invalid MPIN");
      }

      const token = generateToken(user._id, user.userType);
      return responseHandler(res, 200, "Login successfull..!", token);
    }

    const hashedPassword = await hashPassword(mpin);
    user.mpin = hashedPassword;
    const updateUser = await user.save();

    if (updateUser) {
      return responseHandler(res, 200, "User MPIN added successfully..!");
    } else {
      return responseHandler(res, 400, "User MPIN update failed...!");
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The `exports.createExpense` function is responsible for creating a new expense record. Here is a
breakdown of what the function is doing: */
exports.createExpense = async (req, res) => {
  try {
    const createExpenseValidator = createExpenseSchema.validate(req.body, {
      abortEarly: true,
    });
    if (createExpenseValidator.error) {
      return responseHandler(
        res,
        400,
        `Invalid input: ${createExpenseValidator.error}`
      );
    }
    req.body.user = req.userId;
    const newExpense = await Expense.create(req.body);
    if (newExpense) {
      return responseHandler(
        res,
        200,
        `Expense created successfully..!`,
        newExpense
      );
    } else {
      return responseHandler(res, 400, `Expense creation failed...!`);
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};
