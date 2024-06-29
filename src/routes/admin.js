const express = require("express");
const adminController = require("../controllers/adminController");
const authVerify = require("../middlewares/authVerify");
const adminRoute = express.Router();

adminRoute.post("/login", adminController.loginAdmin);

adminRoute.use(authVerify);

adminRoute
  .route("/")
  .post(adminController.createAdmin)
  .get(adminController.getAdmin);

adminRoute
  .route("/admin/:id")
  .put(adminController.editAdmin)
  .get(adminController.getAdminById)
  .delete(adminController.deleteAdmin);

adminRoute.route("/role").post(adminController.createRole);

adminRoute
  .route("/role/:id")
  .put(adminController.editRole)
  .get(adminController.getRole)
  .delete(adminController.deleteRole);

adminRoute.get("/list", adminController.listController);

adminRoute.post("/tier", adminController.createTier);

adminRoute
  .route("/tier/:id")
  .put(adminController.editTier)
  .get(adminController.getTier)
  .delete(adminController.deleteTier);

adminRoute.post("/user", adminController.createUser);

adminRoute
  .route("/user/:id")
  .put(adminController.editUser)
  .get(adminController.getUser)
  .delete(adminController.deleteUser);

adminRoute.post("/event", adminController.createEvent);

adminRoute
  .route("/event/:id")
  .get(adminController.getEvent)
  .put(adminController.editEvent)
  .delete(adminController.deleteEvent);

module.exports = adminRoute;
