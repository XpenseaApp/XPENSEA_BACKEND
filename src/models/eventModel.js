const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
  {
    eventName: { type: String },
    days: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    startTime: { type: Date },
    endTime: { type: Date },
    description: { type: String },
    location: { type: String },
    staffs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      default: "scheduled",
      enum: ["scheduled", "inProgress", "done"],
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
