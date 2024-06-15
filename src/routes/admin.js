const express = require("express");
const adminController = require("../controllers/adminController");
const authVerify = require("../middlewares/authVerify");
const adminRoute = express.Router();

adminRoute
  .route("/")
  .post(authVerify, adminController.createAdmin)
  .get(authVerify, adminController.getAdmin);

adminRoute.put("/admin/:id", authVerify, adminController.editAdmin);

adminRoute.post("/login", adminController.loginAdmin);

adminRoute.route("/role").post(adminController.createRole);

adminRoute
  .route("/role/:id")
  .put(adminController.editRole)
  .get(adminController.getRole);

adminRoute.get("/list", authVerify, adminController.listController);

module.exports = adminRoute;
