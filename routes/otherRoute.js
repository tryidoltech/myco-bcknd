const { getPgDetail, getListingById, getAllPg, getAllListings } = require("../controllers/otherController");

const router = require("express").Router();

// Get Pg Detail by id
router.get("/get/pg/:id",getPgDetail)
// Get Listing Detail By id
router.get("/get/listing/:id",getListingById);
// GET ALL PG
router.get("/get/all/pg",getAllPg)
// GET ALL Listings
router.get("/get/all/listing",getAllListings)
module.exports = router;