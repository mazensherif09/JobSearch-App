import { AsyncHandler } from "../../middleware/global-middleware/AsyncHandler.js";
import { deleteOne } from "../handlers/handlers.js";
import { userModel } from "../../../database/models/user.model.js";
import Twilio from "twilio";

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
  const client = Twilio(process.env.accountSid, process.env.authToken);
  // Check if the user owner of the account
  const user = await userModel.findOne({ email: req.body.email });
  !user && res.json({ message: "Email is wronge" });
  // Generate a random OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  // Save the OTP and its expiration time in the user's session or database
  user.otp = otp;
  await user.save();

  // Send the OTP via SMS using Twilio
  let SMSOptions = {
    from: "+19723167063",
    to: '+201010007883',
    body: `Your OTP is ${otp}`,
  };

  try {
    const message = await client.messages.create(SMSOptions);
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
});

const otp = AsyncHandler(async (req, res, next) => {
  // Find the user document by email
  const user = await userModel.findOne({ email: req.body.email });
  !user && res.json({ message: "user not found" });

  // Verify that the OTP from the request matches the OTP in the user document
  if (user.otp !== req.body.otp) return res.json({ message: "Invalid OTP" });

  await userModel.findByIdAndUpdate(user._id, {
    password: req.body.newPassword,
    passwordChangedAt: Date.now(),
    otp: null,
  });

  user && res.json({ message: "success" });
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
