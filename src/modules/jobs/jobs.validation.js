import joi from "joi";

const addJobVal = joi.object({
  jobTitle: joi.string().min(2).max(100).required().trim(),
  jobLocation: joi.string().valid("onsite", "remotely", "hybrid").required(),
  workingTime: joi.string().valid("part-time", "full-time").required(),
  seniorityLevel: joi.string().valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO").required(),
  jobDescription: joi.string().required(),
  technicalSkills: joi.array().items(joi.string()),
  softSkills: joi.array().items(joi.string()),
});

const CreateApplicationSchemaVal = joi.object({
  id: joi.string().length(24).hex().required(),
  userTechSkills: joi.array().items(joi.string()),
  userSoftSkills: joi.array().items(joi.string()),
  userResume: joi.object({
    fieldname: joi.string(),
    originalname: joi.string(),
    encoding: joi.string(),
    mimetype: joi.string(),
    size: joi.number().max(5242880),
    destination: joi.string(),
    filename: joi.string(),
    path: joi.string(),
  }).required(),
});

const getJobsCompanyVal =  joi.object({
  name : joi.string().min(1).max(100).required(),
});

const updateJobVal = joi.object({
  jobId : joi.string().length(24).hex().required(),
  jobTitle: joi.string().min(2).max(100).trim(),
  jobLocation: joi.string().valid("onsite", "remotely", "hybrid"),
  workingTime: joi.string().valid("part-time", "full-time"),
  seniorityLevel: joi.string().valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
  jobDescription: joi.string(),
  technicalSkills: joi.array().items(joi.string()),
  softSkills: joi.array().items(joi.string()),
});

const paramsIdVal = joi.object({
   id : joi.string().length(24).hex().required()
});

const paramsjobIdVal = joi.object({
  jobId : joi.string().length(24).hex().required()
});

export { addJobVal, paramsIdVal, updateJobVal, CreateApplicationSchemaVal,paramsjobIdVal, getJobsCompanyVal };
