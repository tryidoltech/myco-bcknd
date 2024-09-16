const { addPg } = require("../controllers/ownerController");
const { isAuthenticatedOwner } = require("../middlewares/auth");

const router = require("express").Router();


router.post("/add/pg",isAuthenticatedOwner,addPg)

module.exports = router