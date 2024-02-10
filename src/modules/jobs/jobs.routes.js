import express from 'express';
import { 
addJob, 
applyToJob, 
getAllJobs,
getJobsCompany, 
getJobsFillter, 
removeJob, 
updateJob } from './jobs.controller.js';
import {
CreateApplicationSchemaVal, 
addJobVal, 
getJobsCompanyVal, 
paramsIdVal, 
paramsjobIdVal, 
updateJobVal } from './jobs.validation.js';
import { allowedTo } from '../auth/auth.controller.js';
import { fileUploadSingle } from '../../services/fileUploads/upload.js';
import { presavePdf } from '../../middleware/application/presave.js';
import { validation } from '../../middleware/global-middleware/validation.js'
import { userRoles } from '../../assets/userRoles.js';
import { applicationExist } from '../../middleware/application/checkExist.js';
import { protectedRoutes } from '../../middleware/global-middleware/protectedRoutes.js';
import { verifyOwnerJob } from '../../middleware/job/checkOwner.js';

const jobRouter = express.Router({ mergeParams: true });

jobRouter
.route('/')
/*(1)-------- Add job ---------------*/
.post(protectedRoutes, allowedTo(userRoles.company_HR),validation(addJobVal), addJob)
/*(4)-------- Get all Jobs with their company’s information. ---------------*/
.get(protectedRoutes, allowedTo(userRoles.user, userRoles.company_HR), getAllJobs)
/*(5)-------- Get all Jobs for a specific company ---------------*/
jobRouter.get('/company',
protectedRoutes, allowedTo(userRoles.user,userRoles.company_HR),
validation(getJobsCompanyVal), getJobsCompany)
/*(6)-------- Get all Jobs that match the following filters  ---------------*/
jobRouter.get('/search/filters', protectedRoutes,
 allowedTo(userRoles.user,userRoles.company_HR), getJobsFillter)

/*(7)-------- apply to job  ---------------*/
jobRouter.post('/apply/:id', 
fileUploadSingle("userResume"), 
protectedRoutes,
allowedTo(userRoles.user), 
validation(CreateApplicationSchemaVal),
applicationExist,
presavePdf,
applyToJob)

jobRouter
.route('/:jobId')
/*(2)-------- Delete Job  ---------------*/
.delete(protectedRoutes, allowedTo(userRoles.company_HR), validation(paramsjobIdVal), 
verifyOwnerJob, removeJob)
/*(3)-------- Update Job ---------------*/
.put(protectedRoutes, allowedTo(userRoles.company_HR), verifyOwnerJob,
 validation(updateJobVal), updateJob)

export default jobRouter;