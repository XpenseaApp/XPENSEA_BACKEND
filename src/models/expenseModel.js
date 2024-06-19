const mongoose = require("mongoose");

const expenseSchema = mongoose.Schema(
  {
    title: { type: String },
    amount: { type: Number },
    date: { type: Date },
    time: { type: Date },
    location: { type: String },
    category: { type: String },
    description: { type: String },
    image: { type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      default: "draft",
      enum: ["draft", "mapped"],
    },
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
