require("dotenv").config();
const express = require("express");
const cors = require("cors");
const volleyball = require("volleyball");
const clc = require("cli-color");
const responseHandler = require("./src/helpers/responseHandler");
const adminRoute = require("./src/routes/admin");
const {
  swaggerUi,
  swaggerSpec,
  swaggerOptions,
} = require("./src/swagger/swagger");
const userRoute = require("./src/routes/user");
const loadSecrets = require("./src/config/env.config");
const runOCR = require('./src/jobs/billAnalysis');

const app = express();
app.use(volleyball);
const NODE_ENV = process.env.NODE_ENV;

app.use(cors());
app.use(express.json());

const startServer = async () => {
  try {
    if (NODE_ENV === "production") {
      await loadSecrets();
    }
    const { PORT, API_VERSION } = process.env;

    const BASE_PATH = `/api/${API_VERSION}`;
    require("./src/helpers/connection");
    require("./src/jobs/updateEventStatus");

    app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, swaggerOptions)
    );

    app.use(`${BASE_PATH}/admin`, adminRoute);
    app.use(`${BASE_PATH}/user`, userRoute);

    app.get(BASE_PATH, (req, res) => {
      return responseHandler(
        res,
        200,
        "🛡️ Welcome! All endpoints are fortified. Do you possess the master 🗝️?",
        null
      );
    });

    app.listen(PORT, () => {
      const portMessage = clc.redBright(`✓ App is running on port: ${PORT}`);
      const envMessage = clc.yellowBright(`✓ Environment: ${NODE_ENV || 'development'}`);
      console.log(`${portMessage}\n${envMessage}`);
    });

    // Comment out runOCR() for now to isolate the issue
    // await runOCR();

  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1); // Exit the application with a non-zero status code
  }
};

startServer();
