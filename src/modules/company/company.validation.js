import joi from "joi";

const addCompanyVal = joi.object({
  companyName: joi.string().min(2).max(100).required().trim(),
  description: joi.string().min(2).max(300).required().trim(),
  industry: joi.string().min(2).max(300).required().trim(),
  address: joi.string().min(2).max(300).required().trim(),
  numberOfEmployees: joi
    .number()
    .integer()
    .min(11)
    .max(20)
    .required()
    .options({ convert: false }),
  companyEmail: joi.string().email().required(),
});

const updateCompanyVal = joi.object({
  id: joi.string().length(24).hex().required(),
  companyName: joi.string().min(2).max(100).trim(),
  description: joi.string().min(2).max(300).trim(),
  industry: joi.string().min(2).max(300).trim(),
  address: joi.string().min(2).max(300).trim(),
  numberOfEmployees: joi.number().integer().options({ convert: false }),
  companyEmail: joi.string().email(),
});

const paramsIdVal = joi.object({
  id: joi.string().length(24).hex().required(),
});

const companyIdVal = joi.object({
  company: joi.string().length(24).hex().required(),
});

const queryVal = joi.object({
  query: joi.string().min(1).max(100).required().trim(),
});

export { addCompanyVal, paramsIdVal, updateCompanyVal, queryVal, companyIdVal };
