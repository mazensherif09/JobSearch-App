import joi from "joi";

const addUserVal = joi.object({
  name: joi
    .string()
    .pattern(/[a-zA-Z]/)
    .min(2)
    .max(20)
    .required(),
  email: joi.string().email().required(),
  password: joi
    .string()
    .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .required(),
  confirmPassword: joi.valid(joi.ref("password")).required(),
  age: joi.number().integer().min(10).max(80).required(),
});

const updateAccVal = joi.object({
  firstName: joi
    .string()
    .pattern(/[a-zA-Z]/)
    .min(2)
    .max(20),
  lastName: joi
    .string()
    .pattern(/[a-zA-Z]/)
    .min(2)
    .max(20),
  email: joi.string().email(),
  recoveryEmail: joi.string().email(),
  DOB: joi.date(),
  mobileNumber: joi.string().max(11),
});

const otpVal = joi.object({
  newPassword: joi
    .string()
    .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .required(),
  confirmPassword: joi.valid(joi.ref("newPassword")).required(),
  otp: joi.string().required(),
});

const forgetPasswordVal = joi.object({
  email: joi.string().email().required(),
});

const paramsIdVal = joi.object({
  id: joi.string().length(24).hex().required(),
});

const paramsEmailVal = joi.object({
  recoveryEmail: joi.string().email().required(),
});

export {
  addUserVal,
  paramsIdVal,
  updateAccVal,
  forgetPasswordVal,
  otpVal,
  paramsEmailVal,
};

//.pattern(/^[a-z0-9A-Z]{2-50}@(gmail|yahoo).com$/)
