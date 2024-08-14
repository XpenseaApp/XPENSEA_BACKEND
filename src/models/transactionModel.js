const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    requestedBy: {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
      receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    },
    requestedOn: { type: Date, default: Date.now }, // Request date
    amount: { type: Number, required: true }, // Amount of payment
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Financer who paid
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"], // Status of the payment
      default: "Pending",
    },
    paidOn: { type: Date }, // Date of payment
    paymentMethod: { 
      type: String, 
      enum: ["Bank Transfer", "Cash", "Credit Card", "Other"], // Payment method
    },
    description: { type: String }, // Description of the payment
  },
  { timestamps: true }
);

const transaction = mongoose.model("transaction", transactionSchema);

module.exports = transaction;
