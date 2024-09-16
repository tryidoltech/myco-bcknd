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

exports.isAuthenticatedAuthor = CatchAsyncErrors(async (req,res,next)=>{
   const {adminToken} = req.cookies
    if(!adminToken){
        return next(
            new errorHanler("Admin Please login to access",401)
        )
    }
    const { id } = jwt.verify(adminToken,process.env.JWT_SECRET);
    req.id = id
    
    next();
})