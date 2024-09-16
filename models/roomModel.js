const { default: mongoose } = require("mongoose");

const roomModel = new mongoose.Schema({
  pgName: {
    type: String,
    required: [true, "PG name is required"],
  },
  location: {
    type: String,
    required: [true, "PG location is required"],
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
  pinCode: {
    type: Number,
    minLength: [6, "Please Enter valid pincode"],
    maxLength: [6, "Please Enter valid pincode"],
  },
  rent: {
    type: Array,
    default: [],
  },
  elecricityAmount: {
    type: Number,
    default: 0,
  },
  securityDeposit: {
    period: Number,
    charges: Number,
  },
  noticePeriod: {
    type: Number,
  },
  amenities: {
    type: Array,
    default: [],
  },
  description: {
    type: String,
  },
});

const Room = mongoose.model("Room", roomModel);
module.exports = Room;
