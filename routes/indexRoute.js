const express = require("express");
const {
  user,
  registerUser,
  signin,
  signout,
  userData,
  sendMail,
  changePassword,
  resetPassword,
  UpdateData,
  avatarupload,
  loginUser,
  getAllListings,
  addListing,
} = require("../controllers/indexController");
const { isAuthenticated } = require("../middlewares/auth");
const { authorizeRoles } = require("../jwt/sendToken");

const router = express.Router();

router.get("/", user);
// user data
router.get("/user", isAuthenticated, authorizeRoles("flatemate"), userData);
// login
router.post("/register", registerUser);
// POST signIn
router.post("/signin", loginUser);
// GET SIGNOUT
router.get("/logout", isAuthenticated, signout);
// reset password
router.post("/reset/password", isAuthenticated, resetPassword);
// password changed
router.post("/forgetlink/:id", changePassword);
// Get all listings of user
router.get("/all/listings/:city", getAllListings);
// Get all rooms
router.get("/all/rooms/:city");
// Add Listings
router.post(
  "/add/listing",
  isAuthenticated,
  authorizeRoles("flatemate"),
  addListing
);

module.exports = router;
