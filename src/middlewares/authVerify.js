const jwt = require("jsonwebtoken");

const authVerify = (req, res, next) => {
  const header = req.headers["authorization"];

  const jwtToken = header && header.split(" ")[1];

  if (!jwtToken) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Failed to authenticate token" });
    }
    req.userId = decoded.payload.userId;
    req.roleId = decoded.payload.roleId;
    return next();
  });
};

module.exports = authVerify;
