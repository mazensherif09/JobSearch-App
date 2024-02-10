import { AsyncHandler } from "../../middleware/global-middleware/AsyncHandler.js";
import { deleteOne } from "../handlers/handlers.js";
import { userModel } from "../../../database/models/user.model.js";
import Twilio from "twilio";
import jwt from "jsonwebtoken";
import { AppError } from "../../utils/AppError.js";

const getUserAccountData = AsyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id).select("-password");

  !user && res.json({ message: "user not found" }); //case not found
  user && res.json({ message: "success", AccountData: user });
});

const getProfileDataForAnotherUser = AsyncHandler(async (req, res, next) => {
  // Find the user document by ID
  let user = await userModel
    .findById(req.params.id)
    .select("-password -_id -recoveryEmail");
  !user && res.json({ message: "user not found" }); //case not found

  user && res.json({ message: "success", profile: user });
});

const updateAccount = async (req, res, next) => {
  // update the user account
  let user = await userModel.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
  }); //get the user and update

  !user && res.status(404).json({ message: "user not found" }); //case not found user
  user && res.json({ message: "success", afterUpdate: user }); //user after update
};

const deleteAccount = async (req, res, next) => {
  // Delete the user account
  const user = await userModel.findByIdAndDelete(req.user._id);

  !user && res.json({ message: "user not found" });
  user && res.json({ message: "success", user });
};

const forgetPassword = AsyncHandler(async (req, res, next) => {
  // Check if the user owner of the account
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) return res.json({ message: "Email is wronge" });
  // Generate a random OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  console.log("🚀 ~ forgetPassword ~ otp:", otp);
  // Save the OTP and its expiration time in the user's session or database
  user.otp = otp;
  user.isresetPassword = true;
  await user.save();
  const client = Twilio(process.env.accountSid, process.env.authToken);
  // Send the OTP via SMS using Twilio
  let SMSOptions = {
    from: "+19723167063",
    to: user.mobileNumber,
    body: "Your OTP is " + otp,
  };
  const message = await client.messages.create(SMSOptions);
  const session = {
    Token: jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "15m",
    }),
    expiresIn: new Date(new Date().getTime() + 15 * 60000).toLocaleString(),
  };
  return res.json({
    message: "We sent OTB to " + user.mobileNumber,
    session,
  });
});

const otp = AsyncHandler(async (req, res, next) => {
  // Find the user document by decoded email
  jwt.verify(req.headers.token, process.env.JWT_KEY, async (err, decoded) => {
    if (err) return next(new AppError(err, 401));
    const user = await userModel.findById(decoded.id);
    if (!user) return res.json({ message: "user not found" });
    if (user?.isblocked) return next(new AppError("user is blocked", 401));
    if (!user.isresetPassword) return next(new AppError("session closed", 401));
    if (
      user.passwordChangedAt &&
      decoded.iat * 1000 < new Date(user.passwordChangedAt).getTime()
    ) {
      return next(new AppError("token is invaild", 401));
    }
    if (user.otp !== req.body.otp) return res.json({ message: "Invalid OTP" });
    (user.password = req.body.newPassword),
      (user.passwordChangedAt = Date.now()),
      (user.isresetPassword = false);
    await user.save();
    return res.json({ message: "success" });
  });
});

const getAccountsForRecoveryEmail = AsyncHandler(async (req, res, next) => {
  const users = await userModel.find({
    recoveryEmail: req.params.recoveryEmail,
  });
  !users && res.json({ message: "no one" });

  users && res.json({ message: "Success", users });
});

export {
  getUserAccountData,
  getProfileDataForAnotherUser,
  updateAccount,
  deleteAccount,
  forgetPassword,
  otp,
  getAccountsForRecoveryEmail,
};
