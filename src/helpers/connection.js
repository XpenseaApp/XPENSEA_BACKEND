const mongoose = require("mongoose");
const clc = require("cli-color");

const { MONGO_URL } = process.env;
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;

let retryCount = 0;

const connectWithRetry = () => {
  mongoose
    .connect(MONGO_URL)
    .then(() => {
      console.log(clc.blueBright("✓ Mongoose connection established..!"));
    })
    .catch((error) => {
      retryCount++;
      console.error(
        clc.bgRedBright(
          `✗ Mongoose connection failed (attempt ${retryCount}):`
        ),
        error
      );

      if (retryCount < MAX_RETRIES) {
        console.log(
          clc.yellowBright(
            `⚠️ Retrying connection in ${RETRY_DELAY / 1000} seconds...`
          )
        );
        setTimeout(connectWithRetry, RETRY_DELAY);
      } else {
        console.error(
          clc.bgRedBright("✗ Maximum reconnection attempts reached. Exiting...")
        );
        process.exit(1);
      }
    });
};

// Start the initial connection attempt
connectWithRetry();
