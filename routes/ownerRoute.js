const { addPg, loginOwner, updatePg, deletePg } = require("../controllers/ownerController");
const { authorizeRoles } = require("../jwt/sendToken");
const { isAuthenticated } = require("../middlewares/auth");
// const { isAuthenticatedOwner } = require("../middlewares/auth");

const router = require("express").Router();


// router.post("/add/pg",isAuthenticatedOwner,addPg)
router.post("/signin",loginOwner)
// Add PG DETAILS
router.post("/add/pg",isAuthenticated,authorizeRoles("owner"),addPg)
// Edit PG DETAILS
router.post("/update/pg/:id",isAuthenticated,authorizeRoles("owner"),updatePg);
// Delete Pg
router.post("/delete/pg/:id",isAuthenticated,authorizeRoles("owner"),deletePg);

module.exports = router