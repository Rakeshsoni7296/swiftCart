const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsync = require("../middlewares/catchAsync");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/imgs/users"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e4);
    const fileName = `${file.fieldname}-${uniqueSuffix}.jpg`;
    cb(null, fileName);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      new ErrorHandler("Not an image! Please upload only images.", 400),
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadAvatar = upload.single("avatar");

// Register a user
exports.registerUser = catchAsync(async (req, res, next) => {
  console.log("data we got:", req.body);

  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    ...(req.file && { avatar: `/imgs/users/${req?.file?.filename}` }),
  });

  sendToken(user, 201, res);
});

// Login User
exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // Check if email or password is available
  if (!email || !password)
    return next(new ErrorHandler("Please enter email or password!", 400));

  // Finding user in database
  const user = await User.findOne({ email }).select("+password");

  if (!user) return next(new ErrorHandler("Invalid Email or password.", 401));

  // Check if the password is correct
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched)
    return next(new ErrorHandler("Invalid Email or password.", 401));

  sendToken(user, 200, res);
});

// Forgot Password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new ErrorHandler("User not found with this email.", 404));

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // create reset password url
  // const resetUrl = `${req.protocol}://${req.get(
  //   "host"
  // )}/api/v1/reset-password/${resetToken}`;
  const resetUrl = `${process.env.FRONT_END_URL}/reset-password/${resetToken}`;
  const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested for password reset then please simply, ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "ShopIt Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Hash url token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user)
    return next(
      new ErrorHandler("Password reset token is Invalid or expired.", 400)
    );

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  // Setupe new password
  user.password = req.body.password;

  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Get currently loggedIn user
exports.getUserProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  // Check old password is correct
  const isMatched = await user.comparePassword(req.body.oldPassword);
  if (!isMatched)
    return next(new ErrorHandler("Old password is incorrect", 400));

  if (req.body.password !== req.body.confirmPassword)
    return next(new ErrorHandler("Passwords do not match."));

  user.password = req.body.password;
  await user.save();

  sendToken(user, 200, res);
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.file && req.user.avatar !== "/imgs/users/defaultuser.jpg") {
    const img_path = path.join(__dirname, `../public${req.user.avatar}`);
    fs.unlink(img_path, (err) => {
      if (err) console.log("Error deleting previous avatar.");
    });
  }

  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    ...(req.file && { avatar: `/imgs/users/${req.file.filename}` }),
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Logout
exports.logout = catchAsync(async (req, res, next) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out!",
  });
});

// // Admin Routes
// Get all users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Get details of specific user
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return next(
      new ErrorHandler(`User does not found with id: ${req.params.id}`, 404)
    );

  res.status(200).json({
    success: true,
    user,
  });
});

// Update User
exports.updateUser = catchAsync(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  console.log(newUserData);

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete User
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return next(
      new ErrorHandler(`User does not found with id: ${req.params.id}`, 404)
    );

  const img_path = path.join(__dirname, `../public${user.avatar}`);
  fs.unlink(img_path, (err) => {
    if (err) console.log("Error deleting previous avatar.");
  });

  await user.deleteOne();
  res.status(200).json({
    success: true,
  });
});
