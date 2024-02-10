import bcrypt from "bcrypt";
import { AppError } from "../../utils/AppError.js";

export const checkUser = async (req, res, next) => {
  //check if user is Active 
  if (req.user.status !== "online") return next(new AppError("you must be logged", 409));
  //check the old password
  if (!bcrypt.compareSync(req.body.oldPassword, req.user.password)) {
    return next(new AppError("Incorrect old password", 409));
  }
  //compare between old and new password
  if (bcrypt.compareSync(req.body.newPassword, req.user.password)) {
    return next(new AppError("New password cannot be the same as old password", 409));
  }

  next();
};
