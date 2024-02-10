import { applicationModel } from "../../../database/models/application.model.js";
import startOfDay from "date-fns/startOfDay";
import endOfDay from "date-fns/endOfDay";
import { AsyncHandler } from "../../middleware/global-middleware/AsyncHandler.js";
import { companyModel } from "../../../database/models/company.model.js";
import exceljs from "exceljs";
import { AppError } from "../../utils/AppError.js";
const createExel = AsyncHandler(async (req, res, next) => {
  // handle specific date || today
  let date = req.query.date || Date.now();
  if (!!isNaN(new Date(date))) return next(new AppError("invaild date"));
  //1- handle find company by companyId from user id => from prev middleware (auth)

  let company = await companyModel.findOne({ companyHR: req.user._id });
  if (!company) return next(new AppError("company not found"));
  
  // step 2 handle find company applications by companyId
  let applications = await applicationModel.find({
    company: company._id,
    createdAt: {
      $gte: startOfDay(date),
      $lte: endOfDay(date),
    },
  });
  if (applications && !applications.length)
    return next(new AppError("no applications in this date"));

  // step 3 start to create sheet excel ;)
  let Workbook = new exceljs.Workbook();
  const sheet = Workbook.addWorksheet("applications");
  // step 4 handle columns and width in excel
  sheet.columns = [
    { header: "company", key: "company", width: 30 },
    { header: "job", key: "job", width: 30 },
    { header: "userResume", key: "userResume", width: 50 },
    { header: "userName", key: "userName", width: 30 },
    { header: "userEmail", key: "userEmail", width: 30 },
    { header: "mobileNumber", key: "mobileNumber", width: 30 },
    { header: "date", key: "date", width: 25 },
  ];

  // step 5 handle data in excel by loop
  
  applications.map((val, ind) => {
    sheet.addRow({
      company: company.companyName,
      job: val.jobId.jobTitle,
      userResume: val.userResume.url,
      userName: val.userId.userName,
      userEmail: val.userId.email,
      mobileNumber: val.userId.mobileNumber,
      date: val.createdAt,
    });
  });
  // step 6 handle and send headers to client
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  // and give name to file excel
  res.setHeader(
    "Content-Disposition",
    `attachment;filename=applications-${
      (company.companyName || "document") + date
    }.xlsx`
  );
  // step 7 send excel to client
  Workbook.xlsx.writeBuffer().then((buffer) => {
    res.end(buffer);
  });
});

export { createExel };
