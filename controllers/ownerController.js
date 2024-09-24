const errorHanler = require("../error/errorHandler");
const { sendToken } = require("../jwt/sendToken");
const { CatchAsyncErrors } = require("../middlewares/CatchAsyncerror");
const Room = require("../models/roomModel");
const User = require("../models/userModel");

exports.loginOwner = CatchAsyncErrors(async (req, res, next) => {
  const userModel = await User.findOne({ email: req.body.email })
    .select("+password")
    .exec();
  if (!userModel) return next(new errorHanler("User not found", 500));
  const isMatch = userModel.comparepassword(req.body.password);

  if (!isMatch) return next(new errorHanler("Wrong password", 500));
  if (userModel.role !== "owner")
    return next(new errorHanler("Wrong Owner Credentials", 500));
  sendToken(userModel, 201, res);
});
// Add pg
exports.addPg = CatchAsyncErrors(async (req, res, next) => {
  try {
    const pg = await new Room(req.body).save();
    const owner = await User.findById(req.user.id);
    const file = req.body?.files;
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

      pg.images.push(...singleimg);
    }
    owner.rooms.push(pg._id);
    pg.owner = owner._id;
    await pg.save();
    await owner.save();
    res.status(201).json({
      message: "PG details added succesfully",
      pg,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      error,
    });
  }
});
// Update Pg details
exports.updatePg = CatchAsyncErrors(async (req, res, next) => {
  try {
    const pg = await Room.findByIdAndUpdate(req.params.id, req.body);
    if (req.body.files && req.body.files.length > 0) {
      pg.images.forEach(async (i) => {
        await imagekit.deleteFile(i.fileId);
      });
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

      pg.images.push(...singleimg);
      await pg.save();
    }
    res.status(200).json({
      message: "PG Updated Successfully",
    });
  } catch (error) {
    res.json({
      error,
    });
  }
});
// Delete PG
exports.deletePg = CatchAsyncErrors(async (req, res, next) => {
  try {
    const pg = await Room.findById(req.params.id).populate("owner");
    const user = await User.findById(req.user.id).exec();
    console.log(pg);

    if (pg.user._id.toString() !== user._id.toString()) {
      return res.status(404).json({
        message: `Room is not added by ${user.firstname} + ${user?.lastname}`,
        success: false,
      });
    }
    const filterList = user.listings.filter(
      (i) => i._id.toString() !== pg._id.toString()
    );
    user.listings = filterList;
    await user.save();

    pg.images.forEach(async (i) => {
      await imagekit.deleteFile(i.fileId);
    });
    const list = await Room.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Room Deleted Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);

    res.json({
      error,
    });
  }
});
