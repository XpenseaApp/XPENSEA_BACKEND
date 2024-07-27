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
  editEventSchema,
} = require("../validations");
const moment = require("moment-timezone");
const Report = require("../models/reportModel");
const Expense = require("../models/expenseModel");
const Notification = require("../models/notificationModel");

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
      $or: [{ email: req.body.email }, { mobile: req.body.mobile }],
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

    const deleteAdmin = await Admin.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
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
    const findAdmin = await Admin.findById(id)
      .select("-password")
      .populate("role", "permissions locationAccess")
      .lean();
    const mappedData = {
      ...findAdmin,
      createdAt: moment(findAdmin.createdAt).format("MMM DD YYYY"),
    };
    if (!findAdmin) {
      return responseHandler(res, 404, "Admin not found");
    }
    return responseHandler(res, 200, "Admin found", mappedData);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The `exports.getAdminById` function is responsible for retrieving a admin's information based on the
provided ID. Here is a breakdown of what the function is doing: */
exports.getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Admin ID is required");
    }
    const findAdmin = await Admin.findById(id).lean();
    const mappedData = {
      ...findAdmin,
      createdAt: moment(findAdmin.createdAt).format("MMM DD YYYY"),
    };
    if (!findAdmin) {
      return responseHandler(res, 404, "Admin not found");
    }
    return responseHandler(res, 200, "Admin found", mappedData);
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
    const findRole = await Role.findById(id).lean();
    const mappedData = {
      ...findRole,
      createdAt: moment(findRole.createdAt).format("MMM DD YYYY"),
    };
    if (!findRole) {
      return responseHandler(res, 404, "Role not found");
    }
    return responseHandler(res, 200, "Role found", mappedData);
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
    const { type, pageNo = 1, limit = 10, status, isDeleted } = req.query;
    const skipCount = 10 * (pageNo - 1);
    const filter = {};

    const accessPermissions = {
      admins: "adminManagement_view",
      roles: "roleManagement_view",
      tiers: "tierManagement_view",
      events: "eventManagement_view",
      users: "userManagement_view",
      approvals: "approvalManagement_view",
      finances: "financeManagement_view",
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

      if (isDeleted) {
        filter.isDeleted = isDeleted;
      } else {
        filter.isDeleted = false;
      }

      const totalCount = await Admin.countDocuments(filter);
      const fetchAdmins = await Admin.find(filter)
        .select("-password")
        .populate("role", "roleName")
        .sort({ createdAt: -1 })
        .skip(skipCount)
        .limit(limit)
        .lean();
      const mappedData = fetchAdmins.map((data) => {
        return {
          ...data,
          roleName: data.role.roleName,
          createdAt: moment(data.createdAt).format("MMM DD YYYY"),
        };
      });
      if (!fetchAdmins || fetchAdmins.length === 0) {
        return responseHandler(res, 404, "No Admins found");
      }
      return responseHandler(res, 200, "Admins found", mappedData, totalCount);
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
        .limit(limit)
        .lean();
      const mappedData = fetchRoles.map((data) => {
        return {
          ...data,
          createdAt: moment(data.createdAt).format("MMM DD YYYY"),
          updatedAt: moment(data.updatedAt).format("MMM DD YYYY"),
        };
      });
      if (!fetchRoles || fetchRoles.length === 0) {
        return responseHandler(res, 404, "No Roles found");
      }
      return responseHandler(res, 200, "Roles found", mappedData, totalCount);
    } else if (type === "tiers") {
      const check = await checkAccess(req.roleId, "permissions");

      if (!check || !check.includes(accessPermissions[type])) {
        return responseHandler(
          res,
          403,
          "You don't have permission to perform this action"
        );
      }

      if (status == "true") {
        filter.status = true;
      } else if (status == "false") {
        filter.status = false;
      }
      const totalCount = await Tier.countDocuments(filter);
      const fetchTiers = await Tier.aggregate([
        { $match: filter },
        { $skip: skipCount },
        { $limit: limit },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "tier",
            as: "users",
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            categories: 1,
            totalAmount: 1,
            activationDate: {
              $dateToString: { format: "%b %d %Y", date: "$activationDate" },
            },
            status: 1,
            updatedAt: {
              $dateToString: { format: "%b %d %Y", date: "$updatedAt" },
            },
            createdAt: {
              $dateToString: { format: "%b %d %Y", date: "$createdAt" },
            },
            noOfEmployees: { $size: "$users" },
            noAllowance: { $size: "$categories" },
          },
        },
      ]);

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

      if (status) {
        filter.status = status;
      }

      if (isDeleted) {
        filter.isDeleted = isDeleted;
      } else {
        filter.isDeleted = false;
      }

      const totalCount = await User.countDocuments(filter);
      const fetchUsers = await User.find(filter)
        .populate("tier", "title")
        .skip(skipCount)
        .limit(limit)
        .lean();
      const mappedData = fetchUsers.map((data) => {
        return {
          ...data,
          tier: data.tier.title,
          createdAt: moment(data.createdAt).format("MMM DD YYYY"),
        };
      });
      if (!fetchUsers || fetchUsers.length === 0) {
        return responseHandler(res, 404, "No Users found");
      }
      return responseHandler(res, 200, "Users found", mappedData, totalCount);
    } else if (type === "events") {
      const check = await checkAccess(req.roleId, "permissions");

      if (!check || !check.includes(accessPermissions[type])) {
        return responseHandler(
          res,
          403,
          "You don't have permission to perform this action"
        );
      }

      if (status) {
        filter.status = status;
      }

      const totalCount = await Event.countDocuments(filter);
      const fetchEvents = await Event.find(filter)
        .skip(skipCount)
        .limit(limit)
        .lean();
      const mappedData = fetchEvents.map((data) => {
        return {
          ...data,
          startDate: moment(data.startDate).format("MMM DD YYYY"),
          endDate: moment(data.endDate).format("MMM DD YYYY"),
          staffCount: data.staffs.length,
        };
      });
      if (!fetchEvents || fetchEvents.length === 0) {
        return responseHandler(res, 404, "No Events found");
      }
      return responseHandler(res, 200, "Events found", mappedData, totalCount);
    } else if (type === "approvals") {
      const check = await checkAccess(req.roleId, "permissions");

      if (!check || !check.includes(accessPermissions[type])) {
        return responseHandler(
          res,
          403,
          "You don't have permission to perform this action"
        );
      }

      if (status) {
        filter.status = status;
      }

      const totalCount = await Report.countDocuments(filter);
      const fetchReports = await Report.find(filter)
        .populate("user", "name")
        .populate("expenses")
        .skip(skipCount)
        .limit(limit)
        .lean();
      const mappedData = fetchReports.map((data) => {
        return {
          _id: data._id,
          title: data.title,
          user: data.user.name,
          expenseCount: data.expenses.length,
          totalAmount: data.expenses.reduce(
            (acc, curr) => acc + curr.amount,
            0
          ),
          location: data.location,
          status: data.status,
          reportDate: moment(data.reportDate).format("MMM DD YYYY"),
          createdAt: moment(data.createdAt).format("MMM DD YYYY"),
          updatedAt: moment(data.updatedAt).format("MMM DD YYYY"),
        };
      });
      if (!fetchReports || fetchReports.length === 0) {
        return responseHandler(res, 404, "No Approvals found");
      }
      return responseHandler(
        res,
        200,
        "Approvals found",
        mappedData,
        totalCount
      );
    } else if (type === "approvers") {
      const check = await checkAccess(req.roleId, "permissions");

      if (!check || !check.includes(accessPermissions["users"])) {
        return responseHandler(
          res,
          403,
          "You don't have permission to perform this action"
        );
      }

      const filter = {
        status: true,
        userType: "approver",
      };

      const tier = req.query.tier;

      if (!tier) {
        return responseHandler(res, 400, "Tier is required");
      }

      const tierData = await Tier.findById(tier).select("level");
      const tierLevel = tierData.level;

      const targetTierLevel = tierLevel + 1;
      const targetTier = await Tier.findOne({ level: targetTierLevel }).select(
        "_id"
      );

      if (targetTier) {
        filter.tier = targetTier._id;
      }

      const fetchApprovers = await User.find(filter).select("-mpin");

      if (!fetchApprovers || fetchApprovers.length === 0) {
        const fetchAdmins = await Admin.find({ status: true }).select(
          "-password"
        );

        if (!fetchAdmins || fetchAdmins.length === 0) {
          return responseHandler(res, 404, "No Approvers found");
        }

        return responseHandler(res, 200, "Approvers found", fetchAdmins);
      }
      return responseHandler(res, 200, "Approvers found", fetchApprovers);
    } else if (type === "finances") {
      const check = await checkAccess(req.roleId, "permissions");

      if (!check || !check.includes(accessPermissions[type])) {
        return responseHandler(
          res,
          403,
          "You don't have permission to perform this action"
        );
      }
      filter.status = { $in: ["approved", "reimbursed"] };

      if (status) {
        filter.status = status;
      }

      const totalCount = await Report.countDocuments(filter);
      const fetchReports = await Report.find(filter)
        .populate("user", "name")
        .populate("expenses")
        .skip(skipCount)
        .limit(limit)
        .lean();
      const mappedData = fetchReports.map((data) => {
        return {
          _id: data._id,
          title: data.title,
          user: data.user.name,
          expenseCount: data.expenses.length,
          totalAmount: data.expenses.reduce(
            (acc, curr) => acc + curr.amount,
            0
          ),
          location: data.location,
          status: data.status,
          reportDate: moment(data.reportDate).format("MMM DD YYYY"),
          createdAt: moment(data.createdAt).format("MMM DD YYYY"),
          updatedAt: moment(data.updatedAt).format("MMM DD YYYY"),
        };
      });
      if (!fetchReports || fetchReports.length === 0) {
        return responseHandler(res, 404, "No Approvals found");
      }
      return responseHandler(
        res,
        200,
        "Approvals found",
        mappedData,
        totalCount
      );
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

    const deleteTier = await Tier.findByIdAndUpdate(
      id,
      { status: false },
      {
        new: true,
      }
    );
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

    const findTier = await Tier.findById(id).lean();
    const mappedData = {
      ...findTier,
      activationDate: moment(findTier.activationDate).format("MMM DD YYYY"),
      createdAt: moment(findTier.createdAt).format("MMM DD YYYY"),
    };
    if (!findTier) {
      return responseHandler(res, 404, "Tier not found");
    }
    return responseHandler(res, 200, "Tier found", mappedData);
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
    const checkPhone = await User.findOne({ mobile: req.body.mobile });
    if (checkPhone) {
      return responseHandler(
        res,
        400,
        `User with phone number ${req.body.mobile} already exists`
      );
    }
    const checkEmail = await User.findOne({ email: req.body.email });
    if (checkEmail) {
      return responseHandler(
        res,
        400,
        `User with email ${req.body.email} already exists`
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

    const findUser = await User.findById(id).populate("tier").lean();
    const mappedData = {
      ...findUser,
      tierName: findUser.tier && findUser.tier.title,
      createdAt: moment(findUser.createdAt).format("MMM DD YYYY"),
    };
    if (!findUser) {
      return responseHandler(res, 404, "User not found");
    }
    return responseHandler(res, 200, "User found", mappedData);
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

    const deleteUser = await User.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
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
    req.body.type = "Admin";
    req.body.creator = req.userId;
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

/* The `exports.editEvent` function is responsible for updating an existing event in the system. Here is
a breakdown of what the function is doing: */
exports.editEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Event ID is required");
    }

    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("eventManagement_modify")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }

    const findEvent = await Event.findById(id);
    if (!findEvent) {
      return responseHandler(res, 404, "Event not found");
    }
    const editEventValidator = editEventSchema.validate(req.body, {
      abortEarly: true,
    });
    if (editEventValidator.error) {
      return responseHandler(
        res,
        400,
        `Invalid input: ${editEventValidator.error}`
      );
    }
    const updateEvent = await Event.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (updateEvent) {
      return responseHandler(
        res,
        200,
        `Event updated successfully..!`,
        updateEvent
      );
    } else {
      return responseHandler(res, 400, `Event update failed...!`);
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The `exports.getEvent` function is responsible for retrieving a event's information based on the
provided ID. Here is a breakdown of what the function is doing: */
exports.getEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Event ID is required");
    }
    const findEvent = await Event.findById(id).lean();
    const mappedData = {
      ...findEvent,
      createdAt: moment(findEvent.createdAt).format("MMM DD YYYY"),
    };
    if (!findEvent) {
      return responseHandler(res, 404, "Event not found");
    }
    return responseHandler(res, 200, "Event found", mappedData);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The above code is a JavaScript function that handles the deletion of a event. Here is a breakdown of
what the code is doing: */
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Event ID is required");
    }

    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("eventManagement_modify")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }

    const findEvent = await Event.findById(id);
    if (!findEvent) {
      return responseHandler(res, 404, "Event not found");
    }

    const deleteEvent = await Event.findByIdAndDelete(id);
    if (deleteEvent) {
      return responseHandler(res, 200, `Event deleted successfully..!`);
    } else {
      return responseHandler(res, 400, `Event deletion failed...!`);
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The above code is an asynchronous function in a Node.js environment that handles fetching approval
data based on the provided ID. Here is a breakdown of the code: */
exports.getApproval = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Approval ID is required");
    }

    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("approvalManagement_view")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }

    const fetchReport = await Report.findById(id)
      .populate({
        path: "user",
        populate: { path: "tier" },
      })
      .populate("expenses")
      .populate("approver", "name")
      .lean();

    if (!fetchReport) {
      return responseHandler(res, 404, "Report not found");
    }

    const mappedData = {
      _id: fetchReport._id,
      user: fetchReport.user.name,
      employeeId: fetchReport.user.employeeId,
      tier: fetchReport.user.tier.title,
      reportId: fetchReport.reportId,
      title: fetchReport.title,
      description: fetchReport.description,
      location: fetchReport.location,
      status: fetchReport.status,
      approver: fetchReport?.approver?.name,
      expenses: fetchReport.expenses.map((expense) => {
        return {
          _id: expense._id,
          title: expense.title,
          amount: expense.amount,
          createdAt: moment(expense.createdAt).format("MMM DD YYYY"),
          location: expense.location,
          status: expense.status,
          category: expense.category,
          image: expense.image,
        };
      }),
      totalAmount: fetchReport.expenses.reduce(
        (acc, curr) => acc + curr.amount,
        0
      ),
      reportDate: moment(fetchReport.reportDate).format("MMM DD YYYY"),
      createdAt: moment(fetchReport.createdAt).format("MMM DD YYYY"),
      updatedAt: moment(fetchReport.updatedAt).format("MMM DD YYYY"),
    };

    return responseHandler(res, 200, "Report found", mappedData);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

/* The above code is an asynchronous function in a Node.js environment that handles updating the
approval status of a report along with associated expenses. Here is a breakdown of what the code is
doing: */
exports.updateApproval = async (req, res) => {
  try {
    const { id, action } = req.params;
    const { expenses, reason } = req.body;

    if (expenses.length === 0) {
      return responseHandler(res, 400, "Expenses are required");
    }

    if (!id) {
      return responseHandler(res, 400, "Approval ID is required");
    }

    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("approvalManagement_modify")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }

    const findApproval = await Report.findById(id);
    if (!findApproval) {
      return responseHandler(res, 404, "Approval not found");
    }

    if (findApproval.status !== "pending") {
      return responseHandler(res, 404, "Approval has already done");
    }

    const isApproveAction = action === "approve";
    const newStatus = isApproveAction ? "approved" : "rejected";

    if (isApproveAction) {
      const findApprovalExpensesIds = findApproval.expenses.map((expense) =>
        expense._id.toString()
      );

      if (
        findApprovalExpensesIds.length !== expenses.length ||
        !expenses.every((expenseId) =>
          findApprovalExpensesIds.includes(expenseId.toString())
        )
      ) {
        return responseHandler(res, 400, "Expenses do not match");
      }
    }

    const updateApproval = await Report.findByIdAndUpdate(
      id,
      {
        status: newStatus,
        approverModel: "Admin",
        approver: req.userId,
        $push: { reason: reason },
      },
      { new: true }
    );

    if (!updateApproval) {
      return responseHandler(res, 400, `Approval ${newStatus} failed`);
    }

    await Notification.create({
      content: updateApproval._id,
      user: updateApproval.user,
      status: updateApproval.status,
    });

    if (isApproveAction) {
      await Expense.updateMany(
        { _id: { $in: expenses } },
        { $set: { status: newStatus } },
        { new: true }
      );
    } else {
      await Expense.updateMany(
        { _id: { $in: expenses } },
        { $set: { status: "rejected" } },
        { new: true }
      );

      const remainingExpenses = findApproval.expenses
        .map((expense) => expense._id.toString())
        .filter((id) => !expenses.includes(id));

      await Expense.updateMany(
        { _id: { $in: remainingExpenses } },
        { $set: { status: "accepted" } },
        { new: true }
      );
    }

    return responseHandler(res, 200, `Approval ${newStatus} successfully`);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getUserReports = async (req, res) => {
  try {
    const { id } = req.params;

    const { status } = req.query;

    const filter = {
      user: id,
    };

    if (status) {
      filter.status = status;
    }

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

    const fetchReports = await Report.find(filter)
      .populate("user", "name")
      .populate("expenses")
      .populate("approver", "name")
      .lean();

    if (!fetchReports) {
      return responseHandler(res, 404, "Reports not found");
    }

    const mappedData = fetchReports.map((data) => {
      return {
        _id: data._id,
        title: data.title,
        user: data.user.name,
        expenseCount: data.expenses.length,
        totalAmount: data.expenses.reduce((acc, curr) => acc + curr.amount, 0),
        location: data.location,
        status: data.status,
        approver: data.approver.name,
        reportDate: moment(data.reportDate).format("MMM DD YYYY"),
        createdAt: moment(data.createdAt).format("MMM DD YYYY"),
        updatedAt: moment(data.updatedAt).format("MMM DD YYYY"),
      };
    });

    return responseHandler(res, 200, "Reports found", mappedData);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.reimburseReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { descriptionFinance } = req.body;
    if (!id) {
      return responseHandler(res, 400, "Approval ID is required");
    }

    const reimburse = await Report.findByIdAndUpdate(
      id,
      { status: "reimbursed", descriptionFinance },
      { new: true }
    );

    if (!reimburse) return responseHandler(res, 400, "Reimbursed failed");

    return responseHandler(res, 200, `Reimbursed successfully`);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getFilteredUsers = async (req, res) => {
  try {
    const { tier, role, location } = req.query;
    const filter = {};

    if (tier) {
      filter.tier = { $in: tier };
    }

    if (role) {
      filter.userType = { $in: role };
    }

    if (location) {
      filter.location = { $in: location };
    }

    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("userManagement_view")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }

    const fetchUsers = await User.find(filter).populate("tier").lean();

    if (!fetchUsers) {
      return responseHandler(res, 404, "Users not found");
    }

    const mappedData = fetchUsers.map((data) => {
      return {
        _id: data._id,
        name: data.name,
      };
    });

    return responseHandler(res, 200, "Users found", mappedData);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getFinance = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Approval ID is required");
    }

    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("financeManagement_view")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }

    const fetchReport = await Report.findById(id)
      .populate({
        path: "user",
        populate: { path: "tier" },
      })
      .populate("expenses")
      .populate("approver", "name")
      .lean();

    if (!fetchReport) {
      return responseHandler(res, 404, "Report not found");
    }

    const mappedData = {
      _id: fetchReport._id,
      user: fetchReport.user.name,
      employeeId: fetchReport.user.employeeId,
      tier: fetchReport.user.tier.title,
      reportId: fetchReport.reportId,
      title: fetchReport.title,
      description: fetchReport.description,
      location: fetchReport.location,
      status: fetchReport.status,
      approver: fetchReport?.approver?.name,
      expenses: fetchReport.expenses.map((expense) => {
        return {
          _id: expense._id,
          title: expense.title,
          amount: expense.amount,
          createdAt: moment(expense.createdAt).format("MMM DD YYYY"),
          location: expense.location,
          status: expense.status,
          category: expense.category,
          image: expense.image,
        };
      }),
      totalAmount: fetchReport.expenses.reduce(
        (acc, curr) => acc + curr.amount,
        0
      ),
      reportDate: moment(fetchReport.reportDate).format("MMM DD YYYY"),
      createdAt: moment(fetchReport.createdAt).format("MMM DD YYYY"),
      updatedAt: moment(fetchReport.updatedAt).format("MMM DD YYYY"),
    };

    return responseHandler(res, 200, "Report found", mappedData);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};
