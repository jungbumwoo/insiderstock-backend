import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const getLogin = (req, res) => {
    console.log("getLogin");
}

export const getUser = (req, res) => {
    
}

export const postLogin = (req, res) => {
    console.log("postLogin");
}

// signin or signup 에 따라 token이 전달되는 obj가 다른듯.
export const getTokenFacebook = (req, res, next) => {
    if(true) {
        // signin
        const { accessToken, user } = req.session.passport.user;
        console.log("getToken Func / username:");
        console.log(user.name);
        res.cookie('userName', user.name, { expiresIn: '1d'});
        // res.clearCookie('token');
        return res.redirect(`http://localhost:3000/${accessToken}/#`);
    } else {
        //signup
        // const token = req.authInfo;
    }
}

export const getToken = (req, res) => {
    console.log(req);
    return res.status(200).json({"getTokenResult": "muyaho"});
};

export const signout = (req, res, next) => {
    console.log('singout at usercontroller');
    req.logout();
    req.session = null;
    res.clearCookie('token');
    return res.status(200).json({"signout": "success"})
}

export const kakaoLogin = (req, res) => {
    console.log('kakao passport');
    console.log(req);

}

export const kakaoRestApi = (req, res) => {
    console.log(req);
}

export const postKakaoJsSignup = (req, res) => {
    const token = req.body.access_token;
    const nickname = req.body.nickname;
    const { profileImg110, userid, provider } = req.body;
    User.findOne({ id: userid })
    .exec(async(error, user) => {
        if(error) return res.status(400).json({ error });
        if(user) return res.status(400).json({ message: 'User already registered'})
        const _user = new User({
            name: nickname,
            id: userid,
            provider
        });

        _user.save((error, data) => {
            if (error) {
                return res.status(400).json({
                    message: "Something went wrong at signup"
                })
            }
            if (data) {
                return res.status(201).json({
                    message: "Welcome!"
                })
            }
        })
    })
}

export const postKakaoJsSignin = (req, res) => {
    console.log("postKakaoJsSignin at userController");
    console.log(req.body);
    const nickname = req.body.nickname;
    const { profileImg110, userid } = req.body;

    User.findOne({ id: userid})
    .exec(async(error, user) => {
        if(error) return res.status(400).json({error});
        if(user) {
            console.log("user at postKakaoJsSignin");
            console.log(user);  
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d'});
            res.status(200).json({
                token, nickname, profileImg110
            })
        } else {
            return res.status(400).json({
                message: 'You have to Signup or Something wrong'
            })
        }
    })
}