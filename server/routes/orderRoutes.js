const router = require("express").Router();
const {
  createNewOrder,
  getSingleOrder,
  myOrders,
  allOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const {
  isAuthenticated,
  authorizeRoles,
} = require("../middlewares/authProtection");
module.exports = router;

router
  .route("/orders")
  .get(isAuthenticated, myOrders)
  .post(isAuthenticated, createNewOrder);

router.get(
  "/get-all-orders",
  isAuthenticated,
  authorizeRoles("admin"),
  allOrders
);
router
  .route("/orders/:id")
  .get(isAuthenticated, getSingleOrder)
  .put(isAuthenticated, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteOrder);

module.exports = router;
