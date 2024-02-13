import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    industry: { type: String, required: true },
    address: { type: String, required: true },
    numberOfEmployees: { type: Number, required: true},
    companyEmail: { type: String, required: true, unique: true },
    companyHR: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    jobs: {type: mongoose.Types.ObjectId, ref: "job"}
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

schema.post("init", function (doc) {
  if (doc.imgCover || doc.images) {
    doc.imgCover = process.env.baseURL + "uploads/" + doc.imgCover;
    doc.images = doc.images?.map(
      (img) => process.env.baseURL + "uploads/" + img
    );
  }
});

export const companyModel = mongoose.model("company", schema);
