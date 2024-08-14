const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    requestedBy: {
      admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Admin who requested
      staff: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Staff who requested
    },
    requestedOn: { type: Date, default: Date.now }, // Request date
    amount: { type: Number, required: true }, // Amount of payment
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Financer who paid
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
