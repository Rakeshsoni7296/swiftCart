const router = require("express").Router();
const {
  isAuthenticated,
  authorizeRoles,
} = require("../middlewares/authProtection");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updatePassword,
  updateMe,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  uploadAvatar,
} = require("../controllers/authController");

router.get("/me", isAuthenticated, getUserProfile);
router.post("/register", uploadAvatar, registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.put("/update-password", isAuthenticated, updatePassword);
router.put("/update-profile", isAuthenticated, uploadAvatar, updateMe);
router.get("/users", isAuthenticated, authorizeRoles("admin"), getAllUsers);
router
  .route("/users/:id")
  .get(isAuthenticated, authorizeRoles("admin"), getUser)
  .put(isAuthenticated, authorizeRoles("admin"), updateUser)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteUser);
module.exports = router;
