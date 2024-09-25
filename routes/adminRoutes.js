const {
  admin,
  getAllUsers,
  getAllListings,
  deleteListingAdmin,
} = require("../controllers/adminController");
const { authorizeRoles } = require("../jwt/sendToken");
const { isAuthenticated } = require("../middlewares/auth");

const router = require("express").Router();
router.get("/admin", isAuthenticated, authorizeRoles("superAdmin"), admin);
// get all users
router.get(
  "/get/user",
  isAuthenticated,
  authorizeRoles("superAdmin"),
  getAllUsers
);
// get all listings
router.get(
  "/get/listing",
  isAuthenticated,
  authorizeRoles("superAdmin"),
  getAllListings
);
// Delete Listing Admin
router.get(
  "/delete/listing/:id",
  isAuthenticated,
  authorizeRoles("superAdmin"),
  deleteListingAdmin
);
module.exports = router;
