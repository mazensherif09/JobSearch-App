import { globalError } from "../middleware/global-middleware/globalErrorMiddleware.js";
import bonusRouter from "./Bonus/excel.routes.js";
import authRouter from "./auth/auth.routes.js";
import companyRouter from "./company/company.routes.js";
import jobRouter from "./jobs/jobs.routes.js";
import userRouter from "./user/user.routes.js";

export const AppRoutes = (app, express) => {
  app.use(express.json());
  app.use("/uploads", express.static("uploads"));
  app.use("/api/v1/company", companyRouter);
  app.use("/api/v1/jobs", jobRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/bonus", bonusRouter);
  app.use("/", (req, res) => res.send("hello world"));

  app.use(globalError);
};
