import jwt from "jsonwebtoken";
import { AppError } from "../../utils/AppError.js";
import { userModel } from "../../../database/models/user.model.js";


const checkTokenValidity = (user, decoded) => {
  if (user.passwordChangedAt) {
    const time = parseInt(user.passwordChangedAt.getTime() / 1000);
    if (time > decoded.iat) return new AppError("invalid token");
  }
};

export const protectedRoutes = async (req, res, next) => {
 //1- token is exist or not
  const { token } = req.headers;
  if (!token) return next(new AppError("token is not provided", 401)); //401
  //2-verfiy token &&  Check if the user is logged in
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  if (!decoded?.id) return next(new AppError("Unauthorized", 401)); //401 Unauthorized
  //3- userId -> exist or not
  const user = await userModel.findById(decoded.id);
  if (!user) return next(new AppError("user not found"));
  //4- user token valid or not
  if (user.passwordChangedAt) {
    let time = parseInt(user?.passwordChangedAt.getTime() / 1000);
    if (time > decoded.iat) return next(new AppError("invalid token"));
  }

  req.user = user;
  next();
};
