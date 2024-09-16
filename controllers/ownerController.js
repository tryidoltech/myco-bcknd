const { CatchAsyncErrors } = require("../middlewares/CatchAsyncerror");
const Room = require("../models/roomModel");

exports.addPg = CatchAsyncErrors(async(req,res,next)=>{
    try {
        const pg = await new Room(req.body).save();
        res.status(201).json({
            message:"PG details added succesfully",
            pg
        })

    } catch (error) {
        res.status(400).json({
            error
        })
    }
})