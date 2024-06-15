const mongoose = require("mongoose");

const subSchema = new mongoose.Schema({
  title: { type: String },
  maxAmount: { type: Number },
  status: {
    type: Boolean,
    default: false,
  },
});

const tierSchema = mongoose.Schema(
  {
    title: { type: String },
    activationDate: { type: Date },
    categories: [subSchema],
    status: {
      type: Boolean,
      default: false,
    },
    totalAmount: { type: Number },
  },
  { timestamps: true }
);

const Tier = mongoose.model("Tier", tierSchema);

module.exports = Tier;
