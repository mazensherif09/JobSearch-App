import { Uploader } from "../../cloudnairy/cloudnairy.js";
import { AsyncHandler } from "../global-middleware/AsyncHandler.js";

export const presavePdf = AsyncHandler(async (req, res, next) => {
  req.body.userResume = await Uploader(req.files.userResume.path);

  next();
});