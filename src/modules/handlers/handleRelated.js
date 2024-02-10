import { application } from "express";
import { jobModel } from "../../../database/models/job.model.js";

export async function getCompanyJobApplication(req, res) {
  //1- Get job with company data 
  const job = await jobModel.findOne({ _id: req.params.id }).populate("company");
  //2- set company properties from population and use query case job is null
  const company = job?.company;

  //3- array of objects contains conditions with own message
  const conditions = [
    { condition: job, message: "job not found" },
    { condition: company, message: "company not found" },
    { condition: company?.companyHR.toString() === req.user._id.toString(),
      message: "can't access this job informations"},
  ];

  //4- loop on conditions to get any false condition and show own error message
  for (const condition of conditions) {
    if (!condition.condition) return res.json({ message: condition.message });
  }

  //5- if we got here we are safe :)
  return job;
}
