import { applicationModel } from "../../../database/models/application.model.js";
import { AppError } from "../../utils/AppError.js";

export const applicationExist = async (req, res, next) => {
  const isExist = await applicationModel.findOne({
  userId: req.user._id, jobId: req.params.id});
  
  if (isExist)
  return next(new AppError("can not apply appliction twice", 409));

  next();
};
