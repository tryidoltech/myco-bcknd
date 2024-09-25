const { getAllUsers, getAllListings } = require("../controllers/adminController");
const { authorizeRoles } = require("../jwt/sendToken");
const { isAuthenticated } = require("../middlewares/auth");

const router = require("express").Router();

// get all users
router.get(
    "/get/user",
    isAuthenticated,
    authorizeRoles("admin"),
    getAllUsers
  );
  // get all listings
  router.get(
    "/get/listing",
    isAuthenticated,
    authorizeRoles("admin"),
    getAllListings
  );


module.exports = router;