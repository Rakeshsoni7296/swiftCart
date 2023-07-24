const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsync = require("../middlewares/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Upload Product Images
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/imgs/products"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e7);
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

exports.uploadProductImages = upload.array("images", 5);

// Create new Product
exports.createNewProduct = catchAsync(async (req, res, next) => {
  req.body.user = req.user.id;

  const images = [];
  req.files.forEach((file) => {
    images.push(`/imgs/products/${file.filename}`);
  });

  req.body.images = images;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// Get all products
exports.getProducts = catchAsync(async (req, res, next) => {
  const resultPerPage = 6;

  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter();

  const productsCount = await Product.countDocuments(apiFeatures.query);

  apiFeatures.pagination(resultPerPage);
  const products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    productsCount,
    resultPerPage,
    products,
  });
});

// Get all products
exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

// Get single product
exports.getSingleProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product not found!", 404));

  res.status(200).json({
    status: "success",
    product,
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product not found!", 404));

  const imgs = product.images;

  imgs.forEach((img) => {
    if (
      req.body.unchangedimages &&
      req.body.unchangedimages.find((post) => post === img)
    ) {
      console.log(`Image ${img} haven't deleted.`);
    } else {
      const img_path = path.join(__dirname, `../public${img}`);
      fs.unlinkSync(img_path);
    }
  });

  let images = [];
  if (req.body.unchangedimages) images.push(...req.body.unchangedimages);
  if (req.files)
    req.files.forEach((file) => {
      images.push(`/imgs/products/${file.filename}`);
    });

  req.body.images = images;

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    status: "success",
    success: true,
    product,
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product not found!", 404));
  const imgs = product.images;

  imgs.forEach((img) => {
    const img_path = path.join(__dirname, `../public${img}`);
    fs.unlinkSync(img_path);
  });

  await product.deleteOne();

  res.status(200).json({
    status: "success",
    message: "Product is deleted",
  });
});

// // Product Review controllers
// Create New Review
exports.createProductReview = catchAsync(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    avatar: req.user.avatar,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewdByUserPreviously = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (isReviewdByUserPreviously) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get Product reviews
exports.getProductReviews = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Product review
exports.deleteReview = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString()
  );

  const numOfReviews = reviews.length;

  const ratings =
    reviews.reduce((acc, item) => item.rating + acc, 0) / (reviews.length || 1);

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
  });
});
