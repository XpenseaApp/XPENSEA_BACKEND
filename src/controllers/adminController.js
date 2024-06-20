const responseHandler = require("../helpers/responseHandler");
const Admin = require("../models/adminModel");
const Role = require("../models/roleModel");
const Tier = require("../models/tierModel");
const User = require("../models/userModel");
const Event = require("../models/eventModel");
const { hashPassword, comparePasswords } = require("../utils/bcrypt");
const { generateToken } = require("../utils/generateToken");
const checkAccess = require("../helpers/checkAccess");
const {
  createAdminSchema,
  editAdminSchema,
  createRoleSchema,
  editRoleSchema,
  createTierSchema,
  editTierSchema,
  createUserSchema,
  editUserSchema,
  createEventSchema,
} = require("../validations");

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return responseHandler(res, 400, "Email and password are required");
    }

    const findAdmin = await Admin.findOne({ email });
    if (!findAdmin) {
      return responseHandler(res, 404, "Admin not found");
    }

    const comparePassword = await comparePasswords(
      password,
      findAdmin.password
    );
    if (!comparePassword) {
      return responseHandler(res, 401, "Invalid password");
    }

    const token = generateToken(findAdmin._id, findAdmin.role);

    return responseHandler(res, 200, "Login successfull", token);
  } catch (error) {
    return responseHandler(
      res,
      500,
      `Internal Server Error ${error.message}`,
      null
    );
  }
};

/* The `exports.createAdmin` function is responsible for creating a new admin in the system. Here is a
breakdown of what the function is doing: */
exports.createAdmin = async (req, res) => {
  try {
    const createAdminValidator = createAdminSchema.validate(req.body, {
      abortEarly: true,
    });
    if (createAdminValidator.error) {
      return responseHandler(
        res,
        400,
        `Invalid input: ${createAdminValidator.error}`
      );
    }

    const findAdmin = await Admin.findOne({
      $or: [{ email: req.body.email }, { phone: req.body.phone }],
    });
    if (findAdmin)
      return responseHandler(
        res,
        409,
        `Admin with this email or phone already exists`
      );

    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;

    const newAdmin = await Admin.create(req.body);

    if (newAdmin) {
      return responseHandler(
        res,
        201,
        `New Admin created successfull..!`,
        newAdmin
      );
    } else {
      return responseHandler(res, 400, `Admin creation failed...!`);
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The `exports.editAdmin` function is responsible for updating an existing admin in the system. Here
is a breakdown of what the function is doing: */
exports.editAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Admin ID is required");
    }

    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("adminManagement_modify")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }

    const findAdmin = await Admin.findById(id);
    if (!findAdmin) {
      return responseHandler(res, 404, "Admin not found");
    }

    const editAdminValidator = editAdminSchema.validate(req.body, {
      abortEarly: true,
    });
    if (editAdminValidator.error) {
      return responseHandler(
        res,
        400,
        `Invalid input: ${editAdminValidator.error}`
      );
    }

    const updateAdmin = await Admin.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (updateAdmin) {
      return responseHandler(
        res,
        200,
        `Admin updated successfully..!`,
        updateAdmin
      );
    } else {
      return responseHandler(res, 400, `Admin update failed...!`);
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The above code is a JavaScript function that is used to delete an admin user from a system. Here is
a breakdown of what the code is doing: */
exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Admin ID is required");
    }

    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("adminManagement_modify")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }

    const findAdmin = await Admin.findById(id);
    if (!findAdmin) {
      return responseHandler(res, 404, "Admin not found");
    }

    const deleteAdmin = await Admin.findByIdAndDelete(id);
    if (deleteAdmin) {
      return responseHandler(res, 200, `Admin deleted successfully..!`);
    } else {
      return responseHandler(res, 400, `Admin deletion failed...!`);
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The `exports.getAdmin` function is responsible for retrieving an admin's information based on the
provided ID. Here is a breakdown of what the function is doing: */
exports.getAdmin = async (req, res) => {
  try {
    const id = req.userId;
    if (!id) {
      return responseHandler(res, 400, "Admin ID is required");
    }
    const findAdmin = await Admin.findById(id).populate(
      "role",
      "permissions locationAccess"
    );
    if (!findAdmin) {
      return responseHandler(res, 404, "Admin not found");
    }
    return responseHandler(res, 200, "Admin found", findAdmin);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The `exports.createRole` function is responsible for creating a new role in the system. Here is a
breakdown of what the function is doing: */
exports.createRole = async (req, res) => {
  try {
    const createRoleValidator = createRoleSchema.validate(req.body, {
      abortEarly: true,
    });
    if (createRoleValidator.error) {
      return responseHandler(
        res,
        400,
        `Invalid input: ${createRoleValidator.error}`
      );
    }
    const newRole = await Role.create(req.body);
    if (!newRole) {
      return responseHandler(res, 400, `Role creation failed...!`);
    }
    return responseHandler(
      res,
      201,
      `New Role created successfull..!`,
      newRole
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The `exports.editRole` function is responsible for updating an existing role in the system. Here is
a breakdown of what the function is doing: */
exports.editRole = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Role ID is required");
    }

    const check = await checkAccess(req.roleId, "permissions");
    console.log("🚀 ~ exports.editRole= ~ req.roleId:", req.roleId);
    console.log("🚀 ~ exports.editRole= ~ check:", check);
    if (!check || !check.includes("roleManagement_modify")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }

    const findRole = await Role.findById(id);
    if (!findRole) {
      return responseHandler(res, 404, "Role not found");
    }
    const editRoleValidator = editRoleSchema.validate(req.body, {
      abortEarly: true,
    });
    if (editRoleValidator.error) {
      return responseHandler(
        res,
        400,
        `Invalid input: ${editRoleValidator.error}`
      );
    }
    const updateRole = await Role.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (updateRole) {
      return responseHandler(
        res,
        200,
        `Role updated successfully..!`,
        updateRole
      );
    } else {
      return responseHandler(res, 400, `Role update failed...!`);
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The `exports.getRole` function is responsible for retrieving a role's information based on the
provided ID. Here is a breakdown of what the function is doing: */
exports.getRole = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Role ID is required");
    }
    const findRole = await Role.findById(id);
    if (!findRole) {
      return responseHandler(res, 404, "Role not found");
    }
    return responseHandler(res, 200, "Role found", findRole);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The above code is a JavaScript function that handles the deletion of a role. Here is a breakdown of
what the code is doing: */
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Role ID is required");
    }

    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("roleManagement_modify")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }

    const findRole = await Role.findById(id);
    if (!findRole) {
      return responseHandler(res, 404, "Role not found");
    }

    const deleteRole = await Role.findByIdAndDelete(id);
    if (deleteRole) {
      return responseHandler(res, 200, `Role deleted successfully..!`);
    } else {
      return responseHandler(res, 400, `Role deletion failed...!`);
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The above code is a controller function in a Node.js application that handles listing data based on
the `type` parameter provided in the request query. Here's a breakdown of what the code is doing: */
exports.listController = async (req, res) => {
  try {
    const { type, pageNo = 1 } = req.query;
    const skipCount = 10 * (pageNo - 1);
    const filter = {};

    const accessPermissions = {
      admins: "adminManagement_view",
      roles: "roleManagement_view",
      tiers: "tierManagement_view",
      events: "eventManagement_view",
      users: "userManagement_view",
    };

    if (type === "admins") {
      const check = await checkAccess(req.roleId, "permissions");

      if (!check || !check.includes(accessPermissions[type])) {
        return responseHandler(
          res,
          403,
          "You don't have permission to perform this action"
        );
      }

      const totalCount = await Admin.countDocuments(filter);
      const fetchAdmins = await Admin.find(filter)
        .select("-password")
        .skip(skipCount)
        .limit(10)
        .lean();
      if (!fetchAdmins || fetchAdmins.length === 0) {
        return responseHandler(res, 404, "No Admins found");
      }
      return responseHandler(res, 200, "Admins found", fetchAdmins, totalCount);
    } else if (type === "roles") {
      const check = await checkAccess(req.roleId, "permissions");

      if (!check || !check.includes(accessPermissions[type])) {
        return responseHandler(
          res,
          403,
          "You don't have permission to perform this action"
        );
      }

      const totalCount = await Role.countDocuments(filter);
      const fetchRoles = await Role.find(filter)
        .skip(skipCount)
        .limit(10)
        .lean();
      if (!fetchRoles || fetchRoles.length === 0) {
        return responseHandler(res, 404, "No Roles found");
      }
      return responseHandler(res, 200, "Roles found", fetchRoles, totalCount);
    } else if (type === "tiers") {
      const check = await checkAccess(req.roleId, "permissions");

      if (!check || !check.includes(accessPermissions[type])) {
        return responseHandler(
          res,
          403,
          "You don't have permission to perform this action"
        );
      }

      const totalCount = await Tier.countDocuments(filter);
      const fetchTiers = await Tier.find(filter)
        .skip(skipCount)
        .limit(10)
        .lean();
      if (!fetchTiers || fetchTiers.length === 0) {
        return responseHandler(res, 404, "No Tiers found");
      }
      return responseHandler(res, 200, "Tiers found", fetchTiers, totalCount);
    } else if (type === "users") {
      const check = await checkAccess(req.roleId, "permissions");

      if (!check || !check.includes(accessPermissions[type])) {
        return responseHandler(
          res,
          403,
          "You don't have permission to perform this action"
        );
      }

      const totalCount = await User.countDocuments(filter);
      const fetchUsers = await User.find(filter)
        .skip(skipCount)
        .limit(10)
        .lean();
      if (!fetchUsers || fetchUsers.length === 0) {
        return responseHandler(res, 404, "No Users found");
      }
      return responseHandler(res, 200, "Users found", fetchUsers, totalCount);
    } else if (type === "events") {
      const check = await checkAccess(req.roleId, "permissions");

      if (!check || !check.includes(accessPermissions[type])) {
        return responseHandler(
          res,
          403,
          "You don't have permission to perform this action"
        );
      }

      const totalCount = await Event.countDocuments(filter);
      const fetchEvents = await Event.find(filter)
        .skip(skipCount)
        .limit(10)
        .lean();
      if (!fetchEvents || fetchEvents.length === 0) {
        return responseHandler(res, 404, "No Events found");
      }
      return responseHandler(res, 200, "Events found", fetchEvents, totalCount);
    } else {
      return responseHandler(res, 404, "Invalid type..!");
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The `exports.createTier` function is responsible for creating a new tier in the system. Here is a
breakdown of what the function is doing: */
exports.createTier = async (req, res) => {
  try {
    const createTierValidator = createTierSchema.validate(req.body, {
      abortEarly: true,
    });
    if (createTierValidator.error) {
      return responseHandler(
        res,
        400,
        `Invalid input: ${createTierValidator.error}`
      );
    }
    const createTier = await Tier.create(req.body);
    if (createTier) {
      return responseHandler(
        res,
        200,
        `Tier created successfully..!`,
        createTier
      );
    } else {
      return responseHandler(res, 400, `Tier creation failed...!`);
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The above code is an asynchronous function in a Node.js application that is responsible for editing
a tier in a system. Here is a breakdown of what the code is doing: */
exports.editTier = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Tier ID is required");
    }

    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("tierManagement_modify")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }

    const findTier = await Tier.findById(id);
    if (!findTier) {
      return responseHandler(res, 404, "Tier not found");
    }
    const editTierValidator = editTierSchema.validate(req.body, {
      abortEarly: true,
    });
    if (editTierValidator.error) {
      return responseHandler(
        res,
        400,
        `Invalid input: ${editTierValidator.error}`
      );
    }
    const updateTier = await Tier.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (updateTier) {
      return responseHandler(
        res,
        200,
        `Tier updated successfully..!`,
        updateTier
      );
    } else {
      return responseHandler(res, 400, `Tier update failed...!`);
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The above code is a JavaScript function that handles the deletion of a tier. Here is a breakdown of
what the code is doing: */
exports.deleteTier = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Tier ID is required");
    }

    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("tierManagement_modify")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }

    const findTier = await Tier.findById(id);
    if (!findTier) {
      return responseHandler(res, 404, "Tier not found");
    }

    const deleteTier = await Tier.findByIdAndDelete(id);
    if (deleteTier) {
      return responseHandler(res, 200, `Tier deleted successfully..!`);
    } else {
      return responseHandler(res, 400, `Tier deletion failed...!`);
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The above code is a JavaScript function that is used to retrieve a specific tier by its ID. It is an
asynchronous function that takes a request and response object as parameters. */
exports.getTier = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Tier ID is required");
    }

    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("tierManagement_view")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }

    const findTier = await Tier.findById(id);
    if (!findTier) {
      return responseHandler(res, 404, "Tier not found");
    }
    return responseHandler(res, 200, "Tier found", findTier);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The above code is a JavaScript function that is used to create a new user. Here is a breakdown of
what the code is doing: */
exports.createUser = async (req, res) => {
  try {
    const createUserValidator = createUserSchema.validate(req.body, {
      abortEarly: true,
    });
    if (createUserValidator.error) {
      return responseHandler(
        res,
        400,
        `Invalid input: ${createUserValidator.error}`
      );
    }
    const createUser = await User.create(req.body);
    if (createUser) {
      return responseHandler(
        res,
        200,
        `User created successfully..!`,
        createUser
      );
    } else {
      return responseHandler(res, 400, `User creation failed...!`);
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The above code is an asynchronous function in a Node.js application that is responsible for editing
a user's information. Here is a breakdown of what the code is doing: */
exports.editUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "User ID is required");
    }
    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("userManagement_modify")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }
    const findUser = await User.findById(id);
    if (!findUser) {
      return responseHandler(res, 404, "User not found");
    }
    const editUserValidator = editUserSchema.validate(req.body, {
      abortEarly: true,
    });
    if (editUserValidator.error) {
      return responseHandler(
        res,
        400,
        `Invalid input: ${editUserValidator.error}`
      );
    }
    const updateUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (updateUser) {
      return responseHandler(
        res,
        200,
        `User updated successfully..!`,
        updateUser
      );
    } else {
      return responseHandler(res, 400, `User update failed...!`);
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The above code is a JavaScript function that is used to retrieve a user by their ID. Here is a
breakdown of what the code is doing: */
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "User ID is required");
    }

    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("userManagement_view")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }

    const findUser = await User.findById(id);
    if (!findUser) {
      return responseHandler(res, 404, "User not found");
    }
    return responseHandler(res, 200, "User found", findUser);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The above code is a JavaScript function that is used to delete a user from a database. Here is a
breakdown of what the code is doing: */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "User ID is required");
    }

    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("userManagement_modify")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }

    const findUser = await User.findById(id);
    if (!findUser) {
      return responseHandler(res, 404, "User not found");
    }

    const deleteUser = await User.findByIdAndDelete(id);
    if (deleteUser) {
      return responseHandler(res, 200, "User deleted successfully..!");
    } else {
      return responseHandler(res, 400, "User deletion failed...!");
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The above code is a JavaScript function that handles the creation of an event. Here is a breakdown
of what the code does: */
exports.createEvent = async (req, res) => {
  try {
    const createEventValidator = createEventSchema.validate(req.body, {
      abortEarly: true,
    });
    if (createEventValidator.error) {
      return responseHandler(
        res,
        400,
        `Invalid input: ${createEventValidator.error}`
      );
    }
    const newEvent = await Event.create(req.body);
    if (newEvent) {
      return responseHandler(
        res,
        200,
        `Event created successfully..!`,
        newEvent
      );
    } else {
      return responseHandler(res, 400, `Event creation failed...!`);
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};
