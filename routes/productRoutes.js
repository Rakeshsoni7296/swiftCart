const express = require("express");
const router = express.Router();
const {
  isAuthenticated,
  authorizeRoles,
} = require("../middlewares/authProtection");
const {
  getProducts,
  getAllProducts,
  createNewProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
  uploadProductImages,
} = require("../controllers/productController");

router
  .route("/products")
  .get(getProducts)
  .post(
    isAuthenticated,
    authorizeRoles("admin"),
    uploadProductImages,
    createNewProduct
  );
router
  .route("/products/:id")
  .get(getSingleProduct)
  .put(
    isAuthenticated,
    authorizeRoles("admin"),
    uploadProductImages,
    updateProduct
  )
  .delete(isAuthenticated, authorizeRoles("admin"), deleteProduct);

router.get("/get-all-products", getAllProducts);

router
  .route("/reviews")
  .put(isAuthenticated, createProductReview)
  .get(getProductReviews)
  .delete(isAuthenticated, deleteReview);

module.exports = router;
