const { CatchAsyncErrors } = require("../middlewares/CatchAsyncerror");

exports.sendToken = (user, statusCode, res) => {
  const token = user.getjwttoken();
  const options = {
    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Expires in 1 day
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 1000 * 60 * 60 * 5,
  };
  res
    .status(statusCode)
    .cookie("userToken", token, options)
    .json({ success: true, id: user._id, token });
};

exports.sendAuthorToken = (author, statusCode, res) => {
  const token = author.getjwttoken();
  const options = {
    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Expires in 1 day
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 1000 * 60 * 60 * 5,
  };

  res
    .status(statusCode)
    .cookie("authorToken", token, options)
    .json({ success: true, id: author._id, token });
};
