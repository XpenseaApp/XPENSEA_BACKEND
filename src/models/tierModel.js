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

tierSchema.pre("save", function (next) {
  const tier = this;
  if (tier.isModified("categories") || tier.isNew) {
    tier.totalAmount = tier.categories.reduce(
      (sum, category) => sum + (category.maxAmount || 0),
      0
    );
  }
  next();
});

const Tier = mongoose.model("Tier", tierSchema);

module.exports = Tier;
