import { applicationModel } from "../../../database/models/application.model.js";
import { companyModel } from "../../../database/models/company.model.js";
import { jobModel } from "../../../database/models/job.model.js";
import { AsyncHandler } from "../../middleware/global-middleware/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { JobFilters } from "../../utils/jobFilters.js";

const addJob = AsyncHandler(async (req, res, next) => {
  //1- find wich copmany he works with
  let company = await companyModel.findOne({ companyHR: req.user._id });
  !company && res.json({message: "NO company to add job"})
  
  req.body.addedBy = req.user._id;
  req.body.company = company._id;

  //2- Create a new job document
  const job = new jobModel(req.body);
  await job.save();

  //4- we are safe here
  res.json({ message: "success", newJob: job }); 
});

const updateJob = AsyncHandler(async (req, res, next) => {
  //1- find By Id and Update
  const job = await jobModel.findByIdAndUpdate(req.params.jobId, req.body, 
  {new: true});
  !job && res.json({message: "job not found"})
  
  //2- we are safe here
  job && res.json({ message: "success", AfetrUpdate: job });
});

const removeJob = AsyncHandler(async (req, res, next) => {
  //1- find job By Id and remove it
  const job = await jobModel.findByIdAndDelete(req.params.id);
  !job && res.status(404).json({ message: "job not found" }); //case not found job

  //2- Find the company document by ID and remove the job from the company array
  const company = await companyModel.findOneAndUpdate(
    { companyHR: req.user._id, jobs: req.params.id },
    { $pull: { jobs: req.params.id } },
    { new: true }
  );
  if (!company) return res.json({ message: "company not found" });

  //3- we are safe here
  job && res.json({ message: "success", job: job }); //job after update
});

const getAllJobs = AsyncHandler(async (req, res, next) => {
  //1- create a new instance from class JobFilters
  let jobFilters = new JobFilters(
    jobModel.find({}).populate("company", "-_id -companyHR -numberOfEmployees -id"),
    req.query
  ).pagination();
  //2- //find All job
  let jobs = await jobFilters.mongooseQuery;
  !jobs && res.status(404).json({ message: "job not found" }); //case not found job
  //4- we are safe here
  res.json({ message: "success", page: jobFilters.pageNumber, jobs });
});

const getJobsCompany = AsyncHandler(async (req, res, next) => {
  //1- find company
  let company = await companyModel.findOne({ companyName: req.query.name })
  !company && res.json({ message: "company not found" }); //case not found job
  //2- //find All job
  const jobs = await jobModel.find({company : company._id}).select("-_id");
  !jobs && res.json({ message: "No jobs yet :(" }); //case not found job
 
  //3- we are safe here
  res.json({message: "success",  companyJobs: jobs,});
});

const getJobsFillter = AsyncHandler(async (req, res, next) => {
  //1- create a new instance from class JobFilters
  let jobFilters = new JobFilters(jobModel.find({}), req.query).pagination();
  //2- Apply filters
  jobFilters.mongooseQuery = jobFilters.filter();
  //3- //find All job and check is any match with filters
  let jobs = await jobFilters.mongooseQuery;
  if (jobs.length <= 0) return res.json({ message: "nothing match :(" });
  //4- we are safe here
  res.json({ message: "success", page: jobFilters.pageNumber, jobs });
});

const applyToJob = AsyncHandler(async (req, res, next) => {
  //1- check job is exist
  let job = await jobModel.findOne({ _id: req.params.id });
  if (!job) return res.json({ message: "can not find this job " });
  (req.body.userId = req.user._id) , (req.body.jobId = req.params.id), 
  (req.body.company = job.company._id);

  const application = new applicationModel(req.body);
  //3- Save the new application document in the database
  await application.save();
  //4- we are safe here
  res.json({ message: "success", newApplication: application });
});

export {
  addJob,
  removeJob,
  getAllJobs,
  updateJob,
  getJobsCompany,
  getJobsFillter,
  applyToJob,
};
