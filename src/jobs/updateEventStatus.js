const cron = require("node-cron");
const moment = require("moment-timezone");
const Event = require("../models/eventModel");
require("dotenv").config();

cron.schedule("* * * * *", async () => {
  const now = moment();
  const currentDate = now.format("YYYY-MM-DD");
  const currentTime = now.format("HH:mm");

  try {
    const events = await Event.updateMany(
      {
        status: "scheduled",
        startDate: currentDate,
        startTime: {
          $lte: moment.utc(`${currentDate}T${currentTime}`).toDate(),
        },
      },
      { status: "progress" },
      { new: true }
    );
    console.log(`Updated ${events.eventName} events to progress`);
  } catch (err) {
    console.error("Error updating events:", err);
  }
});
