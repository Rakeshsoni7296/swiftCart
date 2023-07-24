// Setting up config file
const dotenv = require("dotenv");
dotenv.config({ path: "backend/config/config.env" });

// Handle Uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.stack}`);
  console.log(`Shutting down server due to uncaught exception`);
  process.exit(1);
});

const app = require("./app");
const connectDatabase = require("./config/database");

const port = process.env.PORT || 4000;

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Sever is running at: http://localhost:${port} in ${process.env.NODE_ENV} mode.`
  );
});

// Connecting to DB
connectDatabase(server);

// Unhandled Promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  server.close(() => {
    process.exit(1);
  });
});
