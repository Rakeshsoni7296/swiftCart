const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/authProtection");
const {
  processPayment,
  getStripeAPIkey,
} = require("../controllers/paymentController");

router.post("/process-payment", isAuthenticated, processPayment);
router.get("/stripe-apikey", isAuthenticated, getStripeAPIkey);

module.exports = router;
