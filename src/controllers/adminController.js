const responseHandler = require("../helpers/responseHandler");
const Admin = require("../models/adminModel");
const Role = require("../models/roleModel");
const { hashPassword, comparePasswords } = require("../utils/bcrypt");
const { generateToken } = require("../utils/generateToken");
const {
  createAdminSchema,
  editAdminSchema,
  createRoleSchema,
  editRoleSchema,
} = require("../validations");

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return responseHandler(res, 400, "Email and password are required", null);
    }

    const findAdmin = await Admin.findOne({ email });
    if (!findAdmin) {
      return responseHandler(res, 404, "Admin not found", null);
    }

    const comparePassword = await comparePasswords(
      password,
      findAdmin.password
    );
    if (!comparePassword) {
      return responseHandler(res, 401, "Invalid password", null);
    }

    const token = generateToken(findAdmin._id);

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
        `Invalid input: ${createAdminValidator.error}`,
        null
      );
    }

    const findAdmin = await Admin.findOne({
      $or: [{ email: req.body.email }, { phone: req.body.phone }],
    });
    if (findAdmin)
      return responseHandler(
        res,
        409,
        `Admin with this email or phone already exists`,
        null
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
      return responseHandler(res, 400, `Admin creation failed...!`, null);
    }
  } catch (error) {
    return responseHandler(
      res,
      500,
      `Internal Server Error ${error.message}`,
      null
    );
  }
};

/* The `exports.editAdmin` function is responsible for updating an existing admin in the system. Here
is a breakdown of what the function is doing: */
exports.editAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Admin ID is required", null);
    }

    const findAdmin = await Admin.findById(id);
    if (!findAdmin) {
      return responseHandler(res, 404, "Admin not found", null);
    }

    const editAdminValidator = editAdminSchema.validate(req.body, {
      abortEarly: true,
    });
    if (editAdminValidator.error) {
      return responseHandler(
        res,
        400,
        `Invalid input: ${editAdminValidator.error}`,
        null
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
      return responseHandler(res, 400, `Admin update failed...!`, null);
    }
  } catch (error) {
    return responseHandler(
      res,
      500,
      `Internal Server Error ${error.message}`,
      null
    );
  }
};

/* The `exports.getAdmin` function is responsible for retrieving an admin's information based on the
provided ID. Here is a breakdown of what the function is doing: */
exports.getAdmin = async (req, res) => {
  try {
    const id = req.userId;
    if (!id) {
      return responseHandler(res, 400, "Admin ID is required", null);
    }
    const findAdmin = await Admin.findById(id);
    if (!findAdmin) {
      return responseHandler(res, 404, "Admin not found", null);
    }
    return responseHandler(res, 200, "Admin found", findAdmin);
  } catch (error) {
    return responseHandler(
      res,
      500,
      `Internal Server Error ${error.message}`,
      null
    );
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
        `Invalid input: ${createRoleValidator.error}`,
        null
      );
    }
    const newRole = await Role.create(req.body);
    if (!newRole) {
      return responseHandler(res, 400, `Role creation failed...!`, null);
    }
    return responseHandler(
      res,
      201,
      `New Role created successfull..!`,
      newRole
    );
  } catch (error) {
    return responseHandler(
      res,
      500,
      `Internal Server Error ${error.message}`,
      null
    );
  }
};

/* The `exports.editRole` function is responsible for updating an existing role in the system. Here is
a breakdown of what the function is doing: */
exports.editRole = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Role ID is required", null);
    }
    const findRole = await Role.findById(id);
    if (!findRole) {
      return responseHandler(res, 404, "Role not found", null);
    }
    const editRoleValidator = editRoleSchema.validate(req.body, {
      abortEarly: true,
    });
    if (editRoleValidator.error) {
      return responseHandler(
        res,
        400,
        `Invalid input: ${editRoleValidator.error}`,
        null
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
      return responseHandler(res, 400, `Role update failed...!`, null);
    }
  } catch (error) {
    return responseHandler(
      res,
      500,
      `Internal Server Error ${error.message}`,
      null
    );
  }
};

/* The `exports.getRole` function is responsible for retrieving a role's information based on the
provided ID. Here is a breakdown of what the function is doing: */
exports.getRole = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Role ID is required", null);
    }
    const findRole = await Role.findById(id);
    if (!findRole) {
      return responseHandler(res, 404, "Role not found", null);
    }
    return responseHandler(res, 200, "Role found", findRole);
  } catch (error) {
    return responseHandler(
      res,
      500,
      `Internal Server Error ${error.message}`,
      null
    );
  }
};


/* The `exports.listController` function is a controller responsible for listing either admins or roles
based on the `type` parameter provided in the request query. Here is a breakdown of what the
function is doing: */
exports.listController = async (req, res) => {
  try {
    const { type, pageNo = 1 } = req.query;
    const skipCount = 10 * (pageNo - 1);
    const filter = {};

    if (type === "admins") {
      const totalCount = await Admin.countDocuments(filter);
      const fetchAdmins = await Admin.find(filter)
        .select("-password")
        .skip(skipCount)
        .limit(10)
        .lean();
      if (!fetchAdmins || fetchAdmins.length === 0) {
        return responseHandler(res, 404, "No Admins found", null);
      }
      return responseHandler(res, 200, "Admins found", fetchAdmins, totalCount);
    } else if (type === "roles") {
      const totalCount = await Role.countDocuments(filter);
      const fetchRoles = await Role.find(filter)
        .skip(skipCount)
        .limit(10)
        .lean();
      if (!fetchRoles || fetchRoles.length === 0) {
        return responseHandler(res, 404, "No Admins found", null);
      }
      return responseHandler(res, 200, "Admins found", fetchRoles, totalCount);
    }
  } catch (error) {
    return responseHandler(
      res,
      500,
      `Internal Server Error ${error.message}`,
      null
    );
  }
};
