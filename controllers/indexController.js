const errorHanler = require("../error/errorHandler");
const { sendToken } = require("../jwt/sendToken");
const { CatchAsyncErrors } = require("../middlewares/CatchAsyncerror");

const User = require("../models/userModel.js");

const { sendmail } = require("../nodemailer/nodemailer");
const imagekit = require("../middlewares/imagekit").initimagekit();
const path = require("path");

const Owner = require("../models/ownerModel.js");
const Listing = require("../models/listingModel.js");

exports.user = CatchAsyncErrors(async (req, res, next) => {
  const userData = await User.find().exec();

  res.json({ message: "This is user Data", userData });
});
exports.registerUser = CatchAsyncErrors(async (req, res, next) => {
  const userModel = await new User(req.body).save();
  sendToken(userModel, 200, res);
});
exports.userData = CatchAsyncErrors(async (req, res, next) => {
  const userModel = await User.findById(req.user.id).exec();
  res.json({
    userModel,
    authenticated: true,
  });
});
exports.loginUser = CatchAsyncErrors(async (req, res, next) => {
  const userModel = await User.findOne({ email: req.body.email })
    .select("+password")
    .exec();
  if (!userModel) return next(new errorHanler("User not found", 500));
  const isMatch = userModel.comparepassword(req.body.password);

  if (!isMatch) return next(new errorHanler("Wrong password", 500));
  // if (userModel.role !== "flatemate")
  //   return next(new errorHanler("Wrong Tenant Credentials", 500));
  sendToken(userModel, 201, res);
});
exports.signout = CatchAsyncErrors(async (req, res, next) => {
  res
    .cookie("token", "", {
      expires: new Date(Date.now()), // Immediate expiration
      httpOnly: true,
      // secure: true, // Uncomment if using HTTPS
      sameSite: "None", // Adjust this as per your requirement
    })
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
});
exports.sendMail = CatchAsyncErrors(async (req, res, next) => {
  try {
    const userData = await User.findOne({ email: req.body.email }).exec();
    if (!userData) {
      return next(new errorHanler("User with this email does not exist ", 404));
    }
    const url = `http://localhost:5001/user/forgetlink/${userData._id}`;
    userData.resetpasswordToken = "1";
    userData.save();

    sendmail(req, res, next, url);
  } catch (error) {
    console.log(error);
    res.json({
      error,
    });
  }
  // res.json({ url });
});
exports.changePassword = CatchAsyncErrors(async (req, res, next) => {
  const userData = await User.findById({ _id: req.params.id }).exec();

  if (!userData) {
    next(new errorHanler("User not exist"), 500);
  }

  if (userData.resetpasswordToken === "1") {
    userData.password = req.body.password;
    userData.resetpasswordToken = "0";
    userData.save();

    res.status(200).json({
      message: "Password Change Succesfully",
    });
  } else {
    res.status(400).json({
      message: "Link Expired",
    });
  }
});
exports.resetPassword = CatchAsyncErrors(async (req, res, next) => {
  const userData = await User.findById({ _id: req.id }).select("+password");
  const isMatch = userData.comparepassword(req.body.oldpassword);
  if (!isMatch) return next(new errorHanler("Wrong password", 500));
  if (isMatch) {
    userData.password = req.body.newpassword;
    await userData.save();
    sendToken(userData, 201, res);
  }
  res.status(200).json({ message: "Password is changed succesfully" });
});
exports.UpdateData = CatchAsyncErrors(async (req, res, next) => {
  // console.log("hello");
  const userData = await User.findByIdAndUpdate(req.id, req.body).exec();

  res.status(200).json({ message: "user updated successfully" });
});
exports.avatarupload = CatchAsyncErrors(async (req, res, next) => {
  const userData = await User.findById(req.user.id).exec();

  const file = req.files.avatar;
  // console.log(file.name);
  // console.log(userData);

  const modifiedFileName = `demoImage-${Date.now()}${path.extname(file.name)}`;
  if (userData.avatar.fileId !== "") {
    await imagekit.deleteFile(userData.avatar.fileId);
  }
  const { fileId, url } = await imagekit.upload({
    file: file.data,
    fileName: modifiedFileName,
  });
  userData.avatar = { fileId, url };
  await userData.save();
  res.json({ message: "Profile Image uploaded" });
});
exports.updateUserProfile = CatchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
      user,
    });
  } catch (error) {
    res.json({
      error,
    });
  }
});
exports.getAllListings = CatchAsyncErrors(async (req, res, next) => {
  try {
    const listings = await Listing.find({
      city: req.params.city,
    });
    res.send(200).json({
      listings,
    });
  } catch (error) {
    res.json({
      error,
    });
  }
});
exports.addListing = CatchAsyncErrors(async (req, res, next) => {
  try {
    const listing = await new Listing(req.body);
    const user = await User.findById(req.user.id);
    const file = req.files.image;
    if (file && file.length > 0) {
      const singleimg = await Promise.all(
        file.map(async (i) => {
          const modifiedFileName = `roomImage-${Date.now()}${path.extname(
            i.name
          )}`;
          const { fileId, url } = await imagekit.upload({
            file: i.data,
            fileName: modifiedFileName,
          });
          return { fileId, url };
        })
      );

      listing.images.push(...singleimg);
    }

    user.listings.push(listing._id);
    await user.save();
    listing.user = user._id;
    await listing.save();
    res.status(201).json({
      message: "Listing added succesfully",
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
});

exports.deleteListing = CatchAsyncErrors(async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("user");
    const user = await User.findById(req.user.id).exec();
    console.log(listing);

    if (listing.user._id.toString() !== user._id.toString()) {
      return res.status(404).json({
        message: `Listing is not added by ${user.firstname} + ${user?.lastname}`,
        success: false,
      });
    }
    const filterList = user.listings.filter(
      (i) => i._id.toString() !== listing._id.toString()
    );
    user.listings = filterList;
    await user.save();

    listing.images.forEach(async (i) => {
      await imagekit.deleteFile(i.fileId);
    });
    const list = await Listing.findByIdAndDelete(req.params.id);
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
exports.updateListing = CatchAsyncErrors(async (req, res, next) => {
  try {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
      message: "Listing Details updated successfully",
      success: true,
    });
  } catch (error) {
    res.json({
      error,
    });
  }
});
