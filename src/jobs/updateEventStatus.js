const cron = require("node-cron");
const Event = require("../models/eventModel");
require("dotenv").config();

cron.schedule("* * * * *", async () => {
  const now = new Date();
  const currentDate = now.toISOString().split("T")[0];
  const currentTime = now.toTimeString().split(" ")[0].substr(0, 5);

  try {
    const events = await Event.updateMany(
      {
        status: "scheduled",
        startDate: currentDate,
        startTime: {
          $lte: new Date(`${currentDate}T${currentTime}`),
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
