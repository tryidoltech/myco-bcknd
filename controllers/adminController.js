const ImageKit = require("imagekit");
const { CatchAsyncErrors } = require("../middlewares/CatchAsyncerror");
const Listing = require("../models/listingModel");
const User = require("../models/userModel");

exports.admin = CatchAsyncErrors(async (req, res, next) => {
  try {
    const admin = await User.findById(req.user.id);
    res.status(200).json({
      admin,
    });
  } catch (error) {
    res.json({
      error,
    });
  }
});

// GET ALL USERS
exports.getAllUsers = CatchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.find().exec();
    res.status(200).json({
      user,
    });
  } catch (error) {
    res.json({
      error,
    });
  }
});
// GET ALL LISTINGS
exports.getAllListings = CatchAsyncErrors(async (req, res, next) => {
  try {
    const listing = await Listing.find().populate("user");
    res.status(200).json({
      listing,
      success: true,
    });
  } catch (error) {
    res.json({
      error,
    });
  }
});
// Delete Listing
exports.deleteListingAdmin = CatchAsyncErrors(async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("user");
    const user = await User.findById(listing.user._id).exec();

    const filterList = user.listings.filter(
      (i) => i._id.toString() !== listing._id.toString()
    );
    user.listings = filterList;

    listing.images.forEach(async (i) => {
      await ImageKit.deleteFile(i.fileId);
    });
    const list = await Listing.findByIdAndDelete(req.params.id);
    await user.save();

    res.status(200).json({
      message: "Listing Deleted Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);

    res.json({
      error,
    });
  }
});
