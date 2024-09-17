const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ownerModel = new mongoose.Schema(
  {
    rooms: [{ 
      type: mongoose.Schema.Types.ObjectId ,
      ref:"Room"

    }],
    agreements: {
      type: Array,
      default: [],
    }
  },
  { timestamps: true }
);

ownerModel.pre("save", function () {
  if (!this.isModified("password")) {
    return;
  }
  let salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});
ownerModel.methods.comparepassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};
ownerModel.methods.getjwttoken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TIME,
  });
};
const Owner = mongoose.model("Owner", ownerModel);
module.exports = Owner;
