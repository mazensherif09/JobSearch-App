import { companyModel } from "../../../database/models/company.model.js";
import { AppError } from "../../utils/AppError.js";


export const companyExist = async (req, res, next) => {
  // Check if the company already exists
  const find = await companyModel.findOne({
    $or: [{ companyEmail: req.body.companyEmail }, { companyName: req.body.companyName }],
  });
  if (find) return next(new AppError("Company added befor", 409));
  // 409 conflict

  next();
};
