const mongoose = require("mongoose");

const deductionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    amount: { type: Number },
    status: {
      type: Boolean,
      default: true,
    },
    deductBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    deductOn: { type: Date },
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
    },
    mode: {
      type: String,
      enum: ["wallet", "bank"],
    },
    comment: { type: String },
  },
  { timestamps: true }
);

const Deduction = mongoose.model("Deduction", deductionSchema);

module.exports = Deduction;
