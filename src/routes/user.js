const express = require("express");
const userController = require("../controllers/userController");
const authVerify = require("../middlewares/authVerify");
const userRoute = express.Router();

userRoute.post("/send-otp", userController.sendOtp);
userRoute.post("/verify", userController.verifyUser);
userRoute.post("/mpin", userController.mpinHandler);
userRoute.get("/verified/:phone", userController.checkVerified);

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
userRoute.get("/wallet-used", userController.getWalletUsed);
userRoute.put("/event/:id", userController.updateEvent);
userRoute.get("/approval/:id", userController.getApproval);
userRoute.put("/approval/:id/:action", userController.updateApproval);
userRoute.get("/finance/:id", userController.getFinance);
userRoute.put("/reimburse/:id", userController.reimburseReport);

module.exports = userRoute;
