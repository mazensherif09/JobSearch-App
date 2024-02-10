import mongoose from "mongoose";
 

export default async function dbConnection() {
   return await mongoose
   .connect(process.env.DB_URL)
   .then(() => {
        console.log("database connected");
    }).catch(err => {
        console.log("database error", err);
    })
}