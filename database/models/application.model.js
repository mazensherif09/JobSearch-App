import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "job" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    userTechSkills: { type: [String], required: true },
    userSoftSkills: { type: [String], required: true },
    userResume: {url: String, public_id: String},
    company: { type: mongoose.Schema.Types.ObjectId, ref: "company"},
  },
  { timestamps: true }
);

schema.post("init", function (doc) {
  doc.logo = process.env.baseURL + "uploads/" + doc.logo;
});
schema.pre(/^find/, function () {
  this.populate(
    "userId",
    'firstName lastName userName email mobileNumber',
  )
  this.populate("jobId");
});
export const applicationModel = mongoose.model("application", schema);
