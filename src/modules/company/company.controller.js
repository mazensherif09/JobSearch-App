import slugify from "slugify";
import { AsyncHandler } from "../../middleware/global-middleware/AsyncHandler.js";
import { deleteOne } from "../handlers/handlers.js";
import { companyModel } from "../../../database/models/company.model.js";
import { applicationModel } from "../../../database/models/application.model.js";
import { jobModel } from "../../../database/models/job.model.js";
import { getCompanyJobApplication } from "../handlers/handleRelated.js";

const addCompany = AsyncHandler(async (req, res, next) => {
  // Create a new company document with the provided data
  req.body.companyHR = req.user._id;
  const company = new companyModel(req.body);
  // Save the company document to the database
  await company.save();
  res.json({ message: "success", newComapny: company });
});

const updateCompany = AsyncHandler(async (req, res, next) => {
  const company = await companyModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json({ message: "success", AfetrUpdate: company }); //Company after update
});

const deleteCompany = AsyncHandler(async (req, res, next) => {
  const company = await companyModel.findByIdAndDelete(req.params.id);

  !company && res.json({ message: "company not found" });
  company && res.json({ message: "success", company }); //Company after update
});

const getCompanyData = AsyncHandler(async (req, res, next) => {
  //1- check company exists 
  const check = await companyModel.findById(req.params.company)
  !check && res.json({ message: "company not found"});
  //2- find all jobs with this company
  let jobs = await jobModel.find({company: req.params.company})
  //3- if no jobs are found then message no job yet
  jobs.length <= 0 && res.json({ message: "NO job yet :("});
  
  //4- we are safe here
  jobs && res.json({ message: "success", companyJobs: jobs });
});

const searchCompany = AsyncHandler(async (req, res, next) => {
  const company = await companyModel.find({
    companyName: { $regex: req.params.query, $options: "i" },
  });

  !company && res.json({ message: "Company not found" });
  company && res.json({ message: "success", company });
});

const getSpecificJobsApplications = AsyncHandler(async (req, res, next) => {
  //1- get applications for specific job
  let applicationData = await applicationModel
    .find({ jobId : req.params.jobId})
    .populate({ path: "userId", select: "-password" })
    .populate({ path: "jobId", select: "jobTitle" });

    applicationData.length <= 0 && res.json({ message: "NO application yet :("});
    res.json({ message: "success", applications: applicationData });
});

export {
  addCompany,
  getSpecificJobsApplications,
  getCompanyData,
  updateCompany,
  deleteCompany,
  searchCompany,
};

