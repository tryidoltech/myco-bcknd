const jwt = require("jsonwebtoken")
const errorHanler = require("../error/errorHandler")
const { CatchAsyncErrors } = require("./CatchAsyncerror");
// const { token } = require("morgan");






exports.isAuthenticated = CatchAsyncErrors(async (req,res,next)=>{
    
   const {userToken} = req.cookies
    if(!userToken){
        return next(
            new errorHanler("User Please login to Access",401)
        )
    }
    const { id } = jwt.verify(userToken,process.env.JWT_SECRET);
    req.id = id
    
    next();
})

exports.isAuthenticatedOwner = CatchAsyncErrors(async (req,res,next)=>{
   const {ownerToken} = req.cookies
    if(!ownerToken){
        return next(
            new errorHanler("Owner Please login to access",401)
        )
    }
    const { id } = jwt.verify(ownerToken,process.env.JWT_SECRET);
    req.id = id
    
    next();
})