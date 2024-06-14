const responseHandler = (res, status, message, data) => {
  const res_structure = {
    status,
    message,
    data,
  };
  return res.status(status).json(res_structure);
};

module.exports = responseHandler;
