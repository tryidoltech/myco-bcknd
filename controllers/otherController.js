const { CatchAsyncErrors } = require("../middlewares/CatchAsyncerror");
const Listing = require("../models/listingModel");
const Room = require("../models/roomModel");

exports.getPgDetail = CatchAsyncErrors(async(req,res,next)=>{
    try {
        const pg = await Room.findById(req.params.id).exec();
        res.status(200).json({
            pg
        })
    } catch (error) {
        res.json({
            error
        })
    }
})
exports.getListingById = CatchAsyncErrors(async (req, res, next) => {
    try {
      const listing = await Listing.findById(req.params.id).populate({
        path: "user",
        select: "firstname lastname email -_id",
      });
      res.status(200).json({
        listing,
      });
    } catch (error) {
      res.json({
        error,
      });
    }
  });
exports.getAllPg = CatchAsyncErrors(async(req,res,nexrt)=>{
    try {
        const pg = await Room.find().populate({
            path:"owner",
            select:"firstname lastname city -_id"
        });
        res.status(200).json({
            pg
        })
    } catch (error) {
        res.json({
            error
        })
    }
})  
exports.getAllListings = CatchAsyncErrors(async(req,res,next)=>{
    try {
         const list = await Listing.find().populate({
            path:"user",
            select:"firstname lastname city -_id"
         });
         res.status(200).json({
            list
         })
    } catch (error) {
        res.json({
            error
        })
    }
})