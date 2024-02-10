import multer from "multer";
import { v4 as uuid } from "uuid";
import { AppError } from "../../utils/AppError.js";
export const Upload = () => {
  const storage = multer.diskStorage({});
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.includes("pdf")) {
      cb(null, true);
    } else {
      cb(new AppError("pdf only", 401), false);
    }
  };
  const upload = multer({
    storage,
    fileFilter,
  }); 
  return upload;
};
export const fileUploadSingle = (feildname) => Upload().single(feildname);
export const fileUploadArray = (array) => Upload().array(array);
export const fileUploadfields = (fields) => Upload().fields(fields);