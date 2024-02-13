import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { userRoles } from "../../src/assets/userRoles.js";

const schema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    passwordChangedAt: Date,
    recoveryEmail: { type: String},
    DOB: { type: Date, required: true },
    mobileNumber: { type: String, required: true, unique: true },
    isresetPassword: { type: Boolean, default: false },
    isblocked: { type: Boolean, default: false },
    otp: { type: String },
    role: {
      type: String,
      enum: Object.values(userRoles),
      default: "user",
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
  },
  { timestamps: true }
);

schema.pre("save", function () {
  this.userName = this.firstName + this.lastName;
  if (this.password) this.password = bcrypt.hashSync(this.password, 8);
});

schema.pre("findOneAndUpdate", function () {
  if (this._update.password)
    this._update.password = bcrypt.hashSync(this._update.password, 8);
});

export const userModel = mongoose.model("user", schema);
