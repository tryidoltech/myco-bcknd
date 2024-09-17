const errorHanler = require("../error/errorHandler");
const { sendToken } = require("../jwt/sendToken");
const { CatchAsyncErrors } = require("../middlewares/CatchAsyncerror");
const Room = require("../models/roomModel");
const User = require("../models/userModel");

exports.addPg = CatchAsyncErrors(async(req,res,next)=>{
    try {
        const pg = await new Room(req.body).save();
        const owner = await User.findById(req.user.id);
        owner.rooms.push(pg._id);
        pg.owner = owner._id;
        await pg.save()
        await owner.save()
        res.status(201).json({
            message:"PG details added succesfully",
            pg
        })

    } catch (error) {
        console.log(error);
        
        res.status(400).json({
            error
        })
    }
})
exports.loginOwner = CatchAsyncErrors(async (req, res, next) => {
    const userModel = await User.findOne({ email: req.body.email })
      .select("+password")
      .exec();
    if (!userModel) return next(new errorHanler("User not found", 500));
    const isMatch = userModel.comparepassword(req.body.password);
  
    if (!isMatch) return next(new errorHanler("Wrong password", 500));
   if(userModel.role !== "owner") return next(new errorHanler("Wrong Owner Credentials", 500))
    sendToken(userModel, 201, res);
  });