const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    employeeId: { type: String },
    name: { type: String },
    email: { type: String },
    mobile: { type: String },
    password: { type: String },
    image: { type: String },
    otp: { type: Number },
    mpin: { type: Number },
    userType: { type: String },
    status: {
      type: Boolean,
      default: false,
    },
    tier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tier",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    location: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
