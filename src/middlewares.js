import jwt from "jsonwebtoken";

export const requireSignin = async(req, res, next) => {
    console.log(req.headers)
    if(req.headers.authorization){
        let token = req.headers.authorization.split(" ")[1];
        const user = await jwt.verify(token, process.env.JWT_SECRET);
        console.log("user at middlewares requireSignin")
        console.log(user);
        req.user = user;
    } else {
        return res.status(400).json({ message: 'Authorization Required'});
    }
    next();
}
