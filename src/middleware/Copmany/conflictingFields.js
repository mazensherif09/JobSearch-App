import { companyModel } from "../../../database/models/company.model.js";
import { AppError } from "../../utils/AppError.js";

export const conflictingFeilds = async (req, res, next) => {
  if (!req.body.companyEmail && !req.body.companyName) return next();

  // Check if the email or companyName conflicts with any existing data
  const find = await companyModel.findOne({
    $and: [
      {$or: [{ companyEmail: req.body.companyEmail }, { companyName: req.body.companyName }]},
      { companyHRd: { $ne: req.user._id }}
    ]});
  // 409 conflict
  if (find) return next(new AppError("Email or companyName added before ", 409));

  next();
};
