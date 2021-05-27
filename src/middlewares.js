import jwt from "jsonwebtoken";

export const requireSignin = async(req, res, next) => {
    try {
        if(req.headers.authorization){
            let token = req.headers.authorization.split(" ")[1];
            const user = await jwt.verify(token, process.env.JWT_SECRET);
            console.log("✅ user logged In");
            req.user = user;
        } else {
            return res.status(400).json({ "message": 'Authorization Required'});
        }
    } catch(Err) {
        console.log(Err);
        return res.status(400).json({ "message" : "Login Error" });
    }
    next();
}
