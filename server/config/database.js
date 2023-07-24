const mongoose = require("mongoose");

const connectDatabase = (server) => {
  mongoose
    .connect(process.env.DB_LOCAL_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((con) => {
      console.log(
        `MongoDB database connected with host: ${con.connection.host}`
      );
    })
    .catch((error) => {
      console.error(`ERROR: ${error.message}`);
      console.log("Shutting down the server due to MongoDB connection error");
      server.close(() => {
        process.exit(1);
      });
    });
};

module.exports = connectDatabase;
