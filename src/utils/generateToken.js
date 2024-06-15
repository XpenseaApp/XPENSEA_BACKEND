const jwt = require("jsonwebtoken");

exports.generateToken = (userId, roleId) => {
  const payload = {
    roleId,
    userId,
  };
  return jwt.sign({ payload }, process.env.JWT_SECRET, {});
};
