import express from "express";
import {
  addCompany,
  deleteCompany,
  getCompanyData,
  getSpecificJobsApplications,
  searchCompany,
  updateCompany,
} from "./company.controller.js";
import { validation } from "../../middleware/global-middleware/validation.js";
import {
  addCompanyVal,
  companyIdVal,
  paramsIdVal,
  queryVal,
  updateCompanyVal,
} from "./company.validation.js";
// import { uploadSingleFile } from "../../services/fileUploads/upload.js";
import { allowedTo } from "../auth/auth.controller.js";
import { userRoles } from "../../assets/userRoles.js";
import { companyExist } from "../../middleware/Copmany/checkExist.js";
import { conflictingFeilds } from "../../middleware/Copmany/conflictingFields.js";
import { protectedRoutes } from "../../middleware/global-middleware/protectedRoutes.js";
import { verifyCompanyOwner } from "../../middleware/Copmany/verifyCompanyOwner.js";
import { verifyOwnerJob } from "../../middleware/job/checkOwner.js";

const companyRouter = express.Router({ mergeParams: true });

/*(1)-------- Add Company ---------------*/
companyRouter.route("/")
.post(protectedRoutes, allowedTo(userRoles.company_HR), validation(addCompanyVal),
companyExist, addCompany)

/*(6)-------- Get all applications for specific Jobs --------*/
companyRouter.get('/:jobId/applications',
protectedRoutes, allowedTo(userRoles.company_HR),
verifyOwnerJob, getSpecificJobsApplications) 

companyRouter.route("/:id")
/*(2)--------  Update company data -------*/
.put(protectedRoutes, allowedTo(userRoles.company_HR), validation(updateCompanyVal), verifyCompanyOwner,
conflictingFeilds, updateCompany)
/*(3)-------- Delete company data ---------*/
.delete(protectedRoutes, allowedTo(userRoles.company_HR), verifyCompanyOwner, deleteCompany);

/*(4)-------- Get company data  ------------*/
companyRouter.get("/:company/jobs", protectedRoutes, allowedTo(userRoles.company_HR), 
validation(companyIdVal), getCompanyData)

/*(5)-------- Search for a company with a name --------------*/
companyRouter.get('/search/:query', 
protectedRoutes, allowedTo(userRoles.company_HR , userRoles.user), 
validation(queryVal), searchCompany);


export default companyRouter;
