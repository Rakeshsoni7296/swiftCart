const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  //   err.message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });
  }

  if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    // Handling Mongoose Object ID Error
    if (err.name === "CastError") {
      const message = `Resource not found. Invalid ${err.path}`;
      error = new ErrorHandler(message, 400);
    }

    // Handling mongoose validation error
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((value) => value.message);
      error = new ErrorHandler(message, 400);
    }

    // Handling mongoose Duplicate key error
    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered.`;
      error = new ErrorHandler(message, 400);
    }

    // Handling wrong JWT Error
    if (err.name === "JsonWebTokenError") {
      const message = "Json web token is invalid. Try again later.",
        error = new ErrorHandler(message, 400);
    }

    // Handling JWT Expired Error
    if (err.name === "TokenExpiredError") {
      const message = "Json web token is expired. Try again later.",
        error = new ErrorHandler(message, 400);
    }

    res.status(error.statusCode).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
