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

adminRoute.route("/role").post(authVerify, adminController.createRole);

adminRoute
  .route("/role/:id")
  .put(authVerify, adminController.editRole)
  .get(authVerify, adminController.getRole);

adminRoute.get("/list", authVerify, adminController.listController);

adminRoute.post("/tier", authVerify, adminController.createTier);

adminRoute
  .route("/tier/:id")
  .put(authVerify, adminController.editTier)
  .get(authVerify, adminController.getTier);

adminRoute.post("/user", authVerify, adminController.createUser);

adminRoute
  .route("/user/:id")
  .put(authVerify, adminController.editUser)
  .get(authVerify, adminController.getUser);

module.exports = adminRoute;
