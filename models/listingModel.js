const { default: mongoose, Mongoose } = require("mongoose");

const listingModel = new mongoose.Schema({
    location:{
        type:String,
    },
    gender:{
        type:String
    },
    approxRent:{
        type:Number
    },
    occupancy:{
        type:String
    },
    images: [
        {
          type: Object,
          default: {
            fileId: "",
            url: "",
          },
        },
      ],
      highlights:{
        type:Array,
        default:[]
      },
      amenities:{
        type:Array,
        default:[]
      },
      description:{
        type:String
      },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})
const Listing = mongoose.model("Listing",listingModel);
module.exports = Listing