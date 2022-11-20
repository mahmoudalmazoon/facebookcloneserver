const JWT = require("jsonwebtoken")
module.exports = (req,res,next)=>{
    const token = req.get("authorization")?.split(" ")[1]
    let decodedToken;
    try {
        decodedToken = JWT.verify(token,"somesupersecrets")
    } catch (error) {
        return  res.status(404).json({error:error})
    }
    if(!decodedToken){
       return res.status(404).json({message:"NoToken"})
    }
    next()
}