const moment = require("moment-timezone");
const responseHandler = require("../helpers/responseHandler");
const { sendOtp } = require("../helpers/sendOtp");
const Expense = require("../models/expenseModel");
const Notification = require("../models/notificationModel");
const Report = require("../models/reportModel");
const User = require("../models/userModel");
const { hashPassword, comparePasswords } = require("../utils/bcrypt");
const { generateOTP } = require("../utils/generateOTP");
const { generateToken } = require("../utils/generateToken");
const {
  createExpenseSchema,
  createReportSchema,
  problemSchema,
  createUserEventSchema,
  createUserEventEditSchema,
} = require("../validations");
const Problem = require("../models/problemModel");
const Event = require("../models/eventModel");
const mongoose = require("mongoose");
const { request } = require("express");
const runOCR = require('../jobs/billAnalysis');


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
      return responseHandler(res, 200, "Login successfull..!", {
        token,
        userType: user.userType,
        username: user.name,
        employeeId: user.employeeId,
      });
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

/* The above code is a JavaScript function that checks if a user with a specific phone number is
verified. It first retrieves the phone number from the request parameters, then queries the database
to find a user with that phone number. If the user is not found, it returns a 404 status code with
the message "User not found". If the user is found, it checks if the user is verified or not. If the
user is verified, it returns a 200 status code with the message "User is verified" and the value of
the isVerified property from the user object. If the user is */
exports.checkVerified = async (req, res) => {
  try {
    const { phone } = req.params;
    const user = await User.findOne({ mobile: phone });
    if (!user) {
      return responseHandler(res, 404, "User not found");
    }
    if (user.isVerified) {
      return responseHandler(res, 200, "User is verified", user.isVerified);
    } else {
      return responseHandler(res, 400, "User is not verified", user.isVerified);
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
      await runOCR( newExpense._id);
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

/* The `exports.createReport` function is responsible for creating a new report record. Here is a
breakdown of what the function is doing: */
exports.createReport = async (req, res) => {
  try {
    const createReportValidator = createReportSchema.validate(req.body, {
      abortEarly: true,
    });
    if (createReportValidator.error) {
      return responseHandler(
        res,
        400,
        `Invalid input: ${createReportValidator.error.message}`
      );
    }

    const reportCount = await Report.countDocuments();
    const nextReportNumber = reportCount + 1;
    const formattedReportNumber = nextReportNumber.toString().padStart(3, "0");
    req.body.reportId = `Rep#${formattedReportNumber}`;

    const expenseIds = req.body.expenses;
    if (expenseIds.length === 0) {
      return responseHandler(res, 400, "Expenses are required");
    }
    const expenses = await Expense.find({ _id: { $in: expenseIds } });
    const userId = req.userId;

    // Fetch user and populate tier information
    const user = await User.findOne({ _id: userId }).populate("tier");

    // Function to create a new report and send notification
    const createNewReport = async () => {
      req.body.user = req.userId;
      const newReport = await Report.create(req.body);
      if (newReport) {
        const data = {
          content: newReport._id,
          user: req.userId,
          status: newReport.status,
        };
        await Notification.create(data);
        return responseHandler(
          res,
          200,
          `Report created successfully..!`,
          newReport
        );
      } else {
        return responseHandler(res, 400, `Report creation failed...!`);
      }
    };

    // Check if it is an event created by admin
    if (req.body.event) {
      const event = await Event.findOne({ _id: req.body.event });
      if (event.type === "Admin") {
        await Expense.updateMany(
          { _id: { $in: expenseIds } },
          { status: "mapped" }
        );
        return await createNewReport();
      }
      if (!event) {
        return responseHandler(res, 404, "Event not found");
      }
    }

    // Object to keep track of total amounts per category
    const categoryTotals = {};

    for (let expense of expenses) {
      if (expense.status === "mapped") {
        return responseHandler(
          res,
          400,
          `Expense with title ${expense.title} is already mapped.`
        );
      }

      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += expense.amount;
      } else {
        categoryTotals[expense.category] = expense.amount;
      }
    }

    // Check if any category total exceeds the user's tier category max amount
    for (const [title, value] of Object.entries(categoryTotals)) {
      const lowerCaseTitle = title.toLowerCase();
      const tierCategory = user.tier.categories.find(
        (cat) => cat.title.toLowerCase() === lowerCaseTitle
      );
      if (!tierCategory) {
        return responseHandler(res, 400, `Category ${title} not found.`);
      }
      if (tierCategory && tierCategory.status === false) {
        return responseHandler(res, 400, `Category ${title} is disabled.`);
      }
      if (tierCategory && value > tierCategory.maxAmount) {
        return responseHandler(
          res,
          400,
          `Total amount for category ${title} exceeds the maximum allowed.`
        );
      }
    }

    const existingReport = await Report.findOne({
      expenses: { $in: expenseIds },
      status: { $in: ["approved", "reimbursed"] },
    });
    if (existingReport) {
      return responseHandler(
        res,
        400,
        `${existingReport.title} is already included some expenses you mapped.`
      );
    }

    const startOfMonth = moment().startOf("month");
    const endOfMonth = moment().endOf("month");

    const existingReports = await Report.find({
      reportDate: { $gte: startOfMonth.toDate(), $lte: endOfMonth.toDate() },
      status: { $in: ["approved", "reimbursed"] },
    });

    let existingTotalAmount = 0;
    for (let report of existingReports) {
      const reportExpenses = await Expense.find({
        _id: { $in: report.expenses },
      });
      for (let expense of reportExpenses) {
        existingTotalAmount += expense.amount;
      }
    }

    if (existingTotalAmount > user.tier.totalAmount) {
      return responseHandler(
        res,
        400,
        `The total amount of existing reports within the last 30 days exceeds your tier limit of ${user.tier.totalAmount}.`
      );
    }

    await Expense.updateMany(
      { _id: { $in: expenseIds } },
      { status: "mapped" }
    );

    return await createNewReport();
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The above code is a list controller function in a Node.js application that handles requests to fetch
data based on the specified type (reports, expenses, notifications) and page number. Here's a
breakdown of what the code is doing: */
exports.listController = async (req, res) => {
  try {
    const { type, pageNo = 1, status } = req.query;
    const skipCount = 10 * (pageNo - 1);
    const filter = {
      user: req.userId,
    };

    if (type === "reports") {
      const totalCount = await Report.countDocuments(filter);
      const fetchReports = await Report.find(filter)
        .populate({
          path: "expenses",
          select: "amount",
        })
        .skip(skipCount)
        .limit(10)
        .sort({ createdAt: -1 })
        .lean();
      if (!fetchReports || fetchReports.length === 0) {
        return responseHandler(res, 404, "No Reports found", fetchReports);
      }

      const mappedData = fetchReports.map((item) => {
        const totalAmount = item.expenses.reduce(
          (acc, exp) => acc + exp.amount,
          0
        );
        return {
          _id: item._id,
          title: item.title,
          status: item.status,
          totalAmount,
          expenseCount: item.expenses.length,
          date: moment(item.reportDate).format("MMM DD YYYY"),
        };
      });

      return responseHandler(res, 200, "Reports found", mappedData, totalCount);
    } else if (type === "expenses") {
      const totalCount = await Expense.countDocuments(filter);
      const fetchExpenses = await Expense.find(filter)
        .skip(skipCount)
        .limit(10)
        .sort({ createdAt: -1 })
        .lean();
      if (!fetchExpenses || fetchExpenses.length === 0) {
        return responseHandler(res, 404, "No Expenses found", fetchExpenses);
      }

      const mappedData = fetchExpenses.map((item) => {
        return {
          _id: item._id,
          title: item.title,
          status: item.status,
          amount: item.amount,
          category: item.category,
          description: item.description,
          image: item.image,
          date: moment(item.createdAt).format("MMM DD YYYY"),
        };
      });

      return responseHandler(
        res,
        200,
        "Expenses found",
        mappedData,
        totalCount
      );
    } else if (type === "notifications") {
      const totalCount = await Notification.countDocuments(filter);
      const fetchNotifications = await Notification.find(filter)
        .populate({
          path: "content",
          populate: {
            path: "expenses",
            select: "amount",
          },
        })
        .skip(skipCount)
        .limit(10)
        .sort({ createdAt: -1 })
        .lean();
      if (!fetchNotifications || fetchNotifications.length === 0) {
        return responseHandler(
          res,
          404,
          "No Notifications found",
          fetchNotifications
        );
      }

      const mappedData = fetchNotifications.map((item) => {
        const totalAmount = item.content.expenses.reduce(
          (acc, exp) => acc + exp.amount,
          0
        );
        return {
          _id: item._id,
          title: item.content.title,
          status: item.status,
          totalAmount,
          expenseCount: item.content.expenses.length,
          date: moment(item.createdAt).format("MMM DD YYYY"),
        };
      });

      return responseHandler(
        res,
        200,
        "Notifications found",
        mappedData,
        totalCount
      );
    } else if (type === "events") {
      const query = {
        staffs: { $in: [req.userId] },
      };
      if (status) {
        query.status = status;
      }
      const totalCount = await Event.countDocuments(query);
      const fetchEvents = await Event.find(query)
        .skip(skipCount)
        .limit(10)
        .sort({ createdAt: -1 })
        .lean();
      if (!fetchEvents || fetchEvents.length === 0) {
        return responseHandler(res, 404, "No Event found", fetchEvents);
      }

      const mappedData = fetchEvents.map((item) => {
        return {
          _id: item._id,
          eventName: item.eventName,
          startDate: moment(item.startDate).format("YYYY MM DD"),
          endDate: moment(item.endDate).format("YYYY MM DD"),
          startTime: moment(item.startTime).format("hh:mm A"),
          endTime: moment(item.endTime).format("hh:mm A"),
          description: item.description,
          location: item.location,
          status: item.status,
          type: item.type,
        };
      });

      return responseHandler(
        res,
        200,
        "Expenses found",
        mappedData,
        totalCount
      );
    } else if (type === "approvals") {
      const user = await User.findById(req.userId).populate("tier");

      if (!user) {
        return responseHandler(res, 404, "User not found");
      }

      if (user.userType !== "approver") {
        return responseHandler(
          res,
          404,
          "You don't have permission to perform this action"
        );
      }

      let level = 0;
      if (user.tier) {
        level = user.tier.level;
      }

      const result = await Report.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        { $unwind: "$userDetails" },
        {
          $lookup: {
            from: "tiers",
            localField: "userDetails.tier",
            foreignField: "_id",
            as: "tierDetails",
          },
        },
        { $unwind: "$tierDetails" },
        {
          $match: {
            "tierDetails.level": { $lt: level },
          },
        },
        {
          $facet: {
            reports: [{ $match: {} }],
            totalCount: [{ $count: "count" }],
          },
        },
      ]);

      const reports = result[0].reports;
      const totalCount = result[0].totalCount[0]
        ? result[0].totalCount[0].count
        : 0;
      return responseHandler(res, 200, "Approvals found", reports, totalCount);
    } else {
      return responseHandler(res, 404, "Invalid type..!");
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The `exports.getExpense` function is responsible for fetching a specific expense record based on the
provided expense ID. Here is a breakdown of what the function is doing: */
exports.getExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.userId);
    const userid = req.userId;

    if (!id) {
      return responseHandler(res, 404, "Expense ID is required");
    }

    let expense;
    if (user.userType === "approver") {
      expense = await Expense.findOne({ _id: id });
    } else {
      expense = await Expense.findOne({ _id: id, userid });
    }

    if (!expense) {
      return responseHandler(res, 404, "Expense not found");
    }

    const mappedData = {
      _id: expense._id,
      title: expense.title,
      status: expense.status,
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      image: expense.image,
      date: moment(expense.createdAt).format("MMM DD YYYY"),
    };

    // Conditionally add aiScores if available
    if (expense.aiScores) {
      mappedData.aiScores = expense.aiScores;
    }

    return responseHandler(res, 200, "Expense found", mappedData);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};


/* The `exports.getReport` function is responsible for fetching a specific report record based on the
provided report ID. Here is a breakdown of what the function is doing: */
exports.getReport = async (req, res) => {
  try {
    const { id } = req.params;
    const{ isEvent } = req.query;
    const user = req.userId;
    if (!id) {
      return responseHandler(res, 404, "Report ID is required");
    }
    let report;

    if (isEvent == null) {
      report = await Report.findOne({ _id: id, user }).populate("expenses");
    } else if (isEvent) {
      report = await Report.findOne({ event: id, user }).populate("expenses");
      if (!report) {
      const event = await Event.findOne({ _id: id, staffs: { $in: [user] } });
      report = await Report.create({
        user: user,
        event: id,
        expenses: [],
        title: event.eventName,
        description: event.description,
        location: "Event Location",
        status: "drafted",
        reportDate: new Date(),
      });
      }
    } else {
      report = await Report.findOne({ _id: id, user }).populate("expenses");
    }

    if (!report) {
      return responseHandler(res, 404, id+" "+isEvent+" Report not found");
    }

    const mappedData = {
      _id: report._id,
      reportId: report.reportId,
      title: report.title,
      status: report.status,
      totalAmount: report.expenses.reduce((acc, exp) => acc + exp.amount, 0),
      expenseCount: report.expenses.length,
      Event: report.event,
      expenses: report.expenses.map((expense) => ({
        _id: expense._id,
        title: expense.title,
        amount: expense.amount,
        date: moment(expense.date).format("MMM DD YYYY"),
        status: expense.status,
        category: expense.category,
        image: expense.image,
        description: expense.description,
      })),
      date: moment(report.reportDate).format("MMM DD YYYY"),
      reason: report.reason,
    };

    return responseHandler(res, 200, "Report found", mappedData);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The `exports.getCategory` function is responsible for fetching a list of categories. Here is a
breakdown of what the function is doing: */
exports.getCategory = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("tier");
    if (!user) {
      return responseHandler(res, 404, "User not found");
    }
    const mappedData = user.tier.categories
      .filter((item) => item.status)
      .map((item) => ({
        title: item.title.charAt(0).toUpperCase() + item.title.slice(1),
      }));

    return responseHandler(res, 200, "Categories found", mappedData);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The above code is a JavaScript function that is used to change the MPIN (Mobile Personal
Identification Number) for a user. It takes in the mobile number, new MPIN, and OTP (One Time
Password) as input from the request body. Here is a breakdown of the code: */
exports.changeMpin = async (req, res) => {
  try {
    const { mobile, mpin, oldmpin } = req.body;
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

    const comparePassword = await comparePasswords(oldmpin, user.mpin);
    if (!comparePassword) {
      return responseHandler(res, 401, "Invalid MPIN");
    }
    // user.otp = null;
    const hashedPassword = await hashPassword(mpin);
    user.mpin = hashedPassword;
    await user.save();
    return responseHandler(res, 200, "MPIN changed successfully");
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The above code is a JavaScript function that handles reporting a problem. Here is a breakdown of
what the code is doing: */
exports.reportProblem = async (req, res) => {
  try {
    const problemSchemaValidator = problemSchema.validate(req.body, {
      abortEarly: true,
    });
    if (problemSchemaValidator.error) {
      return responseHandler(
        res,
        400,
        `Invalid input: ${problemSchemaValidator.error}`
      );
    }
    req.body.user = req.userId;
    const report = Problem(req.body);
    if (!report) return responseHandler(res, 400, `Report creation failed`);
    return responseHandler(res, 200, "Reported added successfully");
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The above code is a JavaScript function that handles the creation of an event. Here is a breakdown
of what the code does: */
exports.createEvent = async (req, res) => {
  try {
    const createEventValidator = createUserEventSchema.validate(req.body, {
      abortEarly: true,
    });
    if (createEventValidator.error) {
      return responseHandler(
        res,
        400,
        `Invalid input: ${createEventValidator.error}`
      );
    }
    req.body.type = "User";
    req.body.creator = req.userId;
    req.body.staffs = [req.userId];
    const newEvent = await Event.create(req.body);
    if (newEvent) {
      return responseHandler(
        res,
        200,
        `Event created successfully..!`,
        newEvent
      );
    } else {
      return responseHandler(res, 400, `Event creation failed...!`);
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;
    if (!id) {
      return responseHandler(res, 400, "Report ID is required");
    }

    const findReport = await Report.findById(id);
    if (!findReport) {
      return responseHandler(res, 404, "Report not found");
    }

    const reportExpenses = (findReport.expenses || []).map((expense) =>
      expense.toString()
    );
    const requestExpenses = req.body.expenses || [];

    if (requestExpenses.length > 0) {
      const expensesOnlyInRequest = requestExpenses.filter(
        (expense) => !reportExpenses.includes(expense)
      );

      const expensesOnlyInReport = reportExpenses.filter(
        (expense) => !requestExpenses.includes(expense)
      );

      if (expensesOnlyInRequest.length > 0) {
        await Expense.updateMany(
          { _id: { $in: expensesOnlyInRequest } },
          { status: "mapped" }
        );
      }

      if (expensesOnlyInReport.length > 0) {
       if (type == 'save') {
         await Expense.updateMany(
           { _id: { $in: expensesOnlyInReport } },
           { status: "pending" }
         );
       }else {
        await Expense.updateMany(
          { _id: { $in: expensesOnlyInReport } },
          { status: "draft" }
        );
       }
      }
    }

    const updatedReport = await Report.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return responseHandler(
      res,
      200,
      "Report updated successfully",
      updatedReport
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

exports.getWalletUsed = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("tier");
    if (!user) return responseHandler(res, 404, "User not found");
    const totalAmount = user.tier.totalAmount;

    const startOfMonth = moment().startOf("month");
    const endOfMonth = moment().endOf("month");

    const expenses = await Expense.find({
      createdAt: { $gte: startOfMonth.toDate(), $lte: endOfMonth.toDate() },
      status: { $in: ["mapped", "accepted"] },
      user: req.userId,
    });

    const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);

    const mappedData = expenses.map((exp) => {
      return {
        _id: exp._id,
        category: exp.category,
        amount: exp.amount,
        image: exp.image,
        title: exp.title,
      };
    });

    const categories = user.tier.categories;

    return responseHandler(res, 200, "Wallet used successfully", {
      totalAmount,
      totalExpenses,
      expenses: mappedData,
      categories,
    });
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Event ID is required");
    }

    const findEvent = await Event.findById(id);
    if (!findEvent) {
      return responseHandler(res, 404, "Event not found");
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return responseHandler(
      res,
      200,
      "Event updated successfully",
      updatedEvent
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

exports.getApproval = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Approval ID is required");
    }

    const fetchReport = await Report.findById(id)
      .populate({
        path: "user",
        populate: { path: "tier" },
      })
      .populate("expenses")
      .populate("approver", "name")
      .lean();

    if (!fetchReport) {
      return responseHandler(res, 404, "Report not found");
    }

    const mappedData = {
      _id: fetchReport._id,
      user: fetchReport.user.name,
      employeeId: fetchReport.user.employeeId,
      tier: fetchReport.user.tier.title,
      reportId: fetchReport.reportId,
      title: fetchReport.title,
      description: fetchReport.description,
      location: fetchReport.location,
      status: fetchReport.status,
      approver: fetchReport?.approver?.name,
      date: moment(fetchReport.reportDate).format("MMM DD YYYY"),
      expenses: fetchReport.expenses.map((expense) => {
        return {
          _id: expense._id,
          title: expense.title,
          amount: expense.amount,
          createdAt: moment(expense.createdAt).format("MMM DD YYYY"),
          location: expense.location,
          status: expense.status,
          category: expense.category,
          image: expense.image,
        };
      }),
      totalAmount: fetchReport.expenses.reduce(
        (acc, curr) => acc + curr.amount,
        0
      ),
      reportDate: moment(fetchReport.reportDate).format("MMM DD YYYY"),
      createdAt: moment(fetchReport.createdAt).format("MMM DD YYYY"),
      updatedAt: moment(fetchReport.updatedAt).format("MMM DD YYYY"),
    };

    return responseHandler(res, 200, "Report found", mappedData);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.updateApproval = async (req, res) => {
  try {
    const { id, action } = req.params;
    const { expenses, reason } = req.body;

    if (expenses.length === 0) {
      return responseHandler(res, 400, "Expenses are required");
    }

    if (!id) {
      return responseHandler(res, 400, "Approval ID is required");
    }

    const findApproval = await Report.findById(id);
    if (!findApproval) {
      return responseHandler(res, 404, "Approval not found");
    }

    if (findApproval.status !== "pending") {
      return responseHandler(res, 404, "Approval has already done");
    }

    const isApproveAction = action === "approve";
    const newStatus = isApproveAction ? "approved" : "rejected";

    if (isApproveAction) {
      const findApprovalExpensesIds = findApproval.expenses.map((expense) =>
        expense._id.toString()
      );

      if (
        findApprovalExpensesIds.length !== expenses.length ||
        !expenses.every((expenseId) =>
          findApprovalExpensesIds.includes(expenseId.toString())
        )
      ) {
        return responseHandler(res, 400, "Expenses do not match");
      }
    }

    const updateApproval = await Report.findByIdAndUpdate(
      id,
      {
        status: newStatus,
        approverModel: "User",
        approver: req.userId,
        $push: { reason: reason },
      },
      { new: true }
    );

    if (!updateApproval) {
      return responseHandler(res, 400, `Approval ${newStatus} failed`);
    }

    await Notification.create({
      content: updateApproval._id,
      user: updateApproval.user,
      status: updateApproval.status,
    });

    if (isApproveAction) {
      await Expense.updateMany(
        { _id: { $in: expenses } },
        { $set: { status: newStatus } },
        { new: true }
      );
    } else {
      await Expense.updateMany(
        { _id: { $in: expenses } },
        { $set: { status: "rejected" } },
        { new: true }
      );

      const remainingExpenses = findApproval.expenses
        .map((expense) => expense._id.toString())
        .filter((id) => !expenses.includes(id));

      await Expense.updateMany(
        { _id: { $in: remainingExpenses } },
        { $set: { status: "accepted" } },
        { new: true }
      );
    }

    return responseHandler(res, 200, `Approval ${newStatus} successfully`);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getFinance = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Approval ID is required");
    }

    const fetchReport = await Report.findById(id)
      .populate({
        path: "user",
        populate: { path: "tier" },
      })
      .populate("expenses")
      .populate("approver", "name")
      .lean();

    if (!fetchReport) {
      return responseHandler(res, 404, "Report not found");
    }

    const mappedData = {
      _id: fetchReport._id,
      user: fetchReport.user.name,
      employeeId: fetchReport.user.employeeId,
      tier: fetchReport.user.tier.title,
      reportId: fetchReport.reportId,
      title: fetchReport.title,
      description: fetchReport.description,
      location: fetchReport.location,
      status: fetchReport.status,
      approver: fetchReport?.approver?.name,
      expenses: fetchReport.expenses.map((expense) => {
        return {
          _id: expense._id,
          title: expense.title,
          amount: expense.amount,
          createdAt: moment(expense.createdAt).format("MMM DD YYYY"),
          location: expense.location,
          status: expense.status,
          category: expense.category,
          image: expense.image,
        };
      }),
      totalAmount: fetchReport.expenses.reduce(
        (acc, curr) => acc + curr.amount,
        0
      ),
      reportDate: moment(fetchReport.reportDate).format("MMM DD YYYY"),
      createdAt: moment(fetchReport.createdAt).format("MMM DD YYYY"),
      updatedAt: moment(fetchReport.updatedAt).format("MMM DD YYYY"),
    };

    return responseHandler(res, 200, "Report found", mappedData);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.reimburseReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { descriptionFinance } = req.body;
    if (!id) {
      return responseHandler(res, 400, "Approval ID is required");
    }

    const reimburse = await Report.findByIdAndUpdate(
      id,
      { status: "reimbursed", descriptionFinance },
      { new: true }
    );

    if (!reimburse) return responseHandler(res, 400, "Reimbursed failed");

    return responseHandler(res, 200, `Reimbursed successfully`);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};
