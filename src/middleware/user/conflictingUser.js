import { userModel } from "../../../database/models/user.model.js";
import { AppError } from "../../utils/AppError.js";

export const conflictingUser  = async (req, res, next) => {
 // Check if the email or mobileNumber conflicts with any existing data
  const find = await userModel.findOne({
    $and: [
        { $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }]},
        { _id: { $ne: req.user._id }}
      ]
  });
 // 409 conflict
  if (find) return next(new AppError("Email or mobileNumber already exists", 409));
  
  next();
};
