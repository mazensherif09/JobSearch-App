import { AppError } from "./AppError.js";

export class JobFilters {
  //1- construct add properties to new object
  constructor(mongooseQuery, searchQuery) {
    this.searchQuery = searchQuery;
    this.mongooseQuery = mongooseQuery;
    this.filterKeys = [
      "workingTime",
      "jobLocation",
      "seniorityLevel",
      "jobTitle",
      "technicalSkills",
    ];
  }

  // =============== pagination =========================
  // method for getting an object that contains the pagination
  pagination() {
    if (this.searchQuery.page <= 0) this.searchQuery.page = 1;
    let pageNumber = this.searchQuery.page * 1 || 1;
    let pageLimit = 2;
    let skip = (pageNumber - 1) * pageLimit;
    this.pageNumber = pageNumber
    this.mongooseQuery.skip(skip).limit(pageLimit);
    return this
  }
  
  // =============== filter =========================
  // method for getting an object that contains the filter
  filter() {
    const filters = {};
    //1- loop to match the filterKeys with searchQuery key
    for (const key of this.filterKeys) {
      if (this.searchQuery[key] !== undefined) {
    //2- this to make an oject include {key : value}
        filters[key] = this.searchQuery[key];
      }
    }
    //3- return mongoose query with filters
    return this.mongooseQuery.where(filters);
  }
}
