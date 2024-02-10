import { userModel } from "../../../database/models/user.model.js";
import { AppError } from "../../utils/AppError.js";

export const checkEmail = async (req, res, next) => {
  // Check if the user already exists
  const find = await userModel.findOne({
    $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }],
  });
  if (find) return next(new AppError("user exist", 409));
  // 409 conflict

  next();
};
