const jwt = require("jsonwebtoken")
const errorHanler = require("../error/errorHandler")
const { CatchAsyncErrors } = require("./CatchAsyncerror");
const User = require("../models/userModel");
// const { token } = require("morgan");




exports.isAuthenticated = CatchAsyncErrors(async (req, res, next) => {
    // const { token } = await req.cookies;
    const {token} = req.cookies
    // console.log(token)

    if (!token || token === "null") {
        return next(new errorHanler("Please Login to access this resource", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);

    next();
});

// exports.isAuthenticated = CatchAsyncErrors(async (req,res,next)=>{
    
//    const {userToken} = req.cookies
//     if(!userToken){
//         return next(
//             new errorHanler("User Please login to Access",401)
//         )
//     }
//     const { id } = jwt.verify(userToken,process.env.JWT_SECRET);
//     req.id = id
    
//     next();
// })

// exports.isAuthenticatedOwner = CatchAsyncErrors(async (req,res,next)=>{
//    const {ownerToken} = req.cookies
//     if(!ownerToken){
//         return next(
//             new errorHanler("Owner Please login to access",401)
//         )
//     }
//     const { id } = jwt.verify(ownerToken,process.env.JWT_SECRET);
//     req.id = id
    
//     next();
// })