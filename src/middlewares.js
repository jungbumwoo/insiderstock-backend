import jwt from "jsonwebtoken";

export const requireSignin = async(req, res, next) => {
    if(req.headers.authorization){
        console.log(req.headers.authorization);
        const user = await jwt.verify(token, process.env.JWT_PASSWORD);
    } else {
        
    }
    next();
}
