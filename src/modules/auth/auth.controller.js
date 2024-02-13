import jwt from "jsonwebtoken";
import { userModel } from "../../../database/models/user.model.js";
import { AsyncHandler } from "../../middleware/global-middleware/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import bcrypt from "bcrypt";

const signUp = AsyncHandler(async (req, res, next) => {
  //1- Create a new user
  let user = new userModel(req.body);
  //2- save the user body after updating
  await user.save();
  res.json({ message: "success" });
});

const signin = AsyncHandler(async (req, res, next) => {
  //1- Check if the user exists
  let user = await userModel.findOne({
    $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber },
     ],
  });
  //2- if the user and his password are true
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    //3- find the user and update the status
    await userModel.findByIdAndUpdate({ _id: user._id }, { status: "online" });
    let token = jwt.sign(
      { id: user._id, email: user.email, mobileNumber: user.mobileNumber },
      process.env.JWT_KEY
    );
    return res.json({ message: "Success", token });
  }
  next(new AppError("Invalid credentials", 401));
  //401 Unauthorized
});

const changePassword = AsyncHandler(async (req, res, next) => {
  //1- if user and password are correct
  if (req.user) {
    //2- sign token
    let token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_KEY
    );
    //3- update user password
    await userModel.findByIdAndUpdate(req.user._id, {
      password: req.body.newPassword,
      passwordChangedAt: Date.now(),
    });
    return res.json({ message: "Success", token });
  }
  next(new AppError("Invalid credentials", 401)); //401 Unauthorized
});

const allowedTo = (...roles) => {
  return AsyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError(`${roles} only have access to do this`));
    next();
  });
};

export { signUp, signin, changePassword, allowedTo };
