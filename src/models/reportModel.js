const mongoose = require("mongoose");

const reportModel = mongoose.Schema(
  {
    reportId: { type: String },
    title: { type: String },
    reportDate: { type: Date },
    description: { type: String },
    expenses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expense",
      },
    ],
    status: {
      type: String,
      default: "pending",
      enum: ["drafted", "pending", "approved", "rejected"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    location: { type: String },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportModel);

module.exports = Report;
