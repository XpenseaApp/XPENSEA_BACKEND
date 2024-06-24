const Joi = require("joi");

exports.createAdminSchema = Joi.object({
  name: Joi.string().required(),
  designation: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().required(),
});

exports.editAdminSchema = Joi.object({
  name: Joi.string(),
  designation: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  password: Joi.string(),
  role: Joi.string(),
  status: Joi.boolean(),
});

exports.createRoleSchema = Joi.object({
  roleName: Joi.string().required(),
  permissions: Joi.array(),
  locationAccess: Joi.array(),
});

exports.editRoleSchema = Joi.object({
  roleName: Joi.string(),
  permissions: Joi.array(),
  locationAccess: Joi.array(),
  status: Joi.boolean(),
});

exports.createTierSchema = Joi.object({
  title: Joi.string().required(),
  activationDate: Joi.date().required(),
  categories: Joi.array(),
  status: Joi.boolean(),
  totalAmount: Joi.number(),
});

exports.editTierSchema = Joi.object({
  title: Joi.string(),
  activationDate: Joi.date(),
  categories: Joi.array(),
  status: Joi.boolean(),
  totalAmount: Joi.number(),
});

exports.createUserSchema = Joi.object({
  employeeId: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().required(),
  mobile: Joi.string().required(),
  tier: Joi.string().required(),
  userType: Joi.string().required(),
  location: Joi.string().required(),
});

exports.editUserSchema = Joi.object({
  employeeId: Joi.string(),
  name: Joi.string(),
  email: Joi.string(),
  mobile: Joi.string(),
  tier: Joi.string(),
  userType: Joi.string(),
  location: Joi.string(),
  status: Joi.boolean(),
});

exports.editUserSchema = Joi.object({
  employeeId: Joi.string(),
  name: Joi.string(),
  email: Joi.string(),
  mobile: Joi.string(),
  tier: Joi.string(),
  userType: Joi.string(),
  location: Joi.string(),
  status: Joi.boolean(),
});

exports.createExpenseSchema = Joi.object({
  title: Joi.string().required(),
  amount: Joi.number().required(),
  date: Joi.date().required(),
  time: Joi.date().required(),
  location: Joi.string().required(),
  category: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required(),
});

exports.createReportSchema = Joi.object({
  title: Joi.string().required(),
  reportDate: Joi.date().required(),
  description: Joi.string().required(),
  expenses: Joi.array().required(),
  location: Joi.string().required(),
  type: Joi.string().required(),
  status: Joi.string(),
  event: Joi.string(),
});

exports.createEventSchema = Joi.object({
  eventName: Joi.string().required(),
  days: Joi.number().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  startTime: Joi.date().required(),
  endTime: Joi.date().required(),
  description: Joi.string().required(),
  location: Joi.string().required(),
  staffs: Joi.array().required(),
});

exports.problemSchema = Joi.object({
  description: Joi.string().required(),
  to: Joi.string().required(),
})