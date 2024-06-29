const express = require("express");
const adminController = require("../controllers/adminController");
const authVerify = require("../middlewares/authVerify");
const adminRoute = express.Router();

adminRoute
  .route("/")
  .post(authVerify, adminController.createAdmin)
  .get(authVerify, adminController.getAdmin);

adminRoute
  .route("/:id")
  .put(authVerify, adminController.editAdmin)
  .get(authVerify, adminController.getAdminById)
  .delete(authVerify, adminController.deleteAdmin);

adminRoute.post("/login", adminController.loginAdmin);

adminRoute.route("/role").post(authVerify, adminController.createRole);

adminRoute
  .route("/role/:id")
  .put(authVerify, adminController.editRole)
  .get(authVerify, adminController.getRole)
  .delete(authVerify, adminController.deleteRole);

adminRoute.get("/list", authVerify, adminController.listController);

adminRoute.post("/tier", authVerify, adminController.createTier);

adminRoute
  .route("/tier/:id")
  .put(authVerify, adminController.editTier)
  .get(authVerify, adminController.getTier)
  .delete(authVerify, adminController.deleteTier);

adminRoute.post("/user", authVerify, adminController.createUser);

adminRoute
  .route("/user/:id")
  .put(authVerify, adminController.editUser)
  .get(authVerify, adminController.getUser)
  .delete(authVerify, adminController.deleteUser);

adminRoute.post("/event", authVerify, adminController.createEvent);
adminRoute
  .route("/event/:id")
  .get(authVerify, adminController.getEvent)
  .put(authVerify, adminController.editEvent)
  .delete(authVerify, adminController.deleteEvent);

module.exports = adminRoute;
