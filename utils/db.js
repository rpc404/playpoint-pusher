const mongoose = require("mongoose");

module.exports = {
  dbConfig: () => {
    mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => console.log("🗂 : Database Connected to Playpoint!"))
      .catch((err) => {
        console.log("database connection failed. exiting now...");
        console.error(err);
        process.exit(1);
      });
  },
};
