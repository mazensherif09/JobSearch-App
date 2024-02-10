import { companyModel } from "../../../database/models/company.model.js";
import { userModel } from "../../../database/models/user.model.js";
import { AppError } from "../../utils/AppError.js";

export const verifyCompanyOwner = async (req, res, next) => {
   // Find the company document by ID
  const company = await companyModel.findById(req.params.id)
  if (!company) return next(new AppError("company not found"));

  // Verify that the user making the request is the owner of the company document
  if (company.companyHR.toString() !== req.user._id.toString())
  return next(new AppError("you are not the owner"));
  

  next();
};
