import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    jobTitle: { type: String, required: true },
    jobLocation: {
      type: String,
      enum: ["onsite", "remotely", "hybrid"],
      required: true,
    },
    workingTime: {
      type: String,
      enum: ["part-time", "full-time"],
      required: true,
    },
    seniorityLevel: {
      type: String,
      enum: ["Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"],
      required: true,
    },
    jobDescription: { type: String, required: true },
    technicalSkills: { type: [String], required: true },
    softSkills: { type: [String], },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "company"}
  },
  { timestamps: true }
);

schema.post("init", function (doc) {
  doc.image = process.env.baseURL + "uploads/" + doc.image;
});

export const jobModel = mongoose.model("job", schema);
