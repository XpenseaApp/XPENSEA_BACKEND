const express = require("express");
const userController = require("../controllers/userController");
const authVerify = require("../middlewares/authVerify");
const userRoute = express.Router();

userRoute.post("/send-otp", userController.sendOtp);
userRoute.post("/verify", userController.verifyUser);
userRoute.post("/mpin", userController.mpinHandler);

userRoute.use(authVerify);

userRoute.post("/expense", userController.createExpense);
userRoute.post("/report", userController.createReport);
userRoute.get("/list", userController.listController);
userRoute.get("/expense/:id", userController.getExpense);
userRoute.get("/report/:id", userController.getReport);
userRoute.get("/category", userController.getCategory);
userRoute.put("/change-mpin", userController.changeMpin);
userRoute.post("/report-problem", userController.reportProblem);
userRoute.post("/event", userController.createEvent);
userRoute.put("/report/:id", userController.updateReport);

module.exports = userRoute;
