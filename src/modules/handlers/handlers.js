import { AsyncHandler } from "../../middleware/global-middleware/AsyncHandler.js";

export const deleteOne = (model) => {
  return AsyncHandler(async (req, res, next) => {
        let document = await model.findByIdAndDelete(req.params.id);
        !document && res.status(404).json({ message: "document not found" });
        document && res.json({ message: "success", document });
      });
}