import { companyModel } from "../../../database/models/company.model.js";
import { jobModel } from "../../../database/models/job.model.js";
import { AppError } from "../../utils/AppError.js";

export const verifyOwnerJob = async (req, res, next) => {
   // Find the company document by ID
  const job = await jobModel.findById(req.params.jobId)
  if (!job) return next(new AppError("job not found"));

  // Verify that the user making the request is the owner of the company document
  if (job.addedBy.toString() !== req.user._id.toString())
  return next(new AppError("you are not the owner"));
  

  next();
};
