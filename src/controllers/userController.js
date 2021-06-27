import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const getToken = (req, res) => {
    console.log(`getToken accepted`);
    return res.status(200).json({"getTokenResult": "muyaho"});
};

export const kakaoLoginCallback = (req, res) => {
    console.log("kakaologincallback");
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.status(200).json({ username: req.user.name, token});
    // console.log(`req.user`, req.user);
}

export const signout = (req, res, next) => {
    console.log('singout at usercontroller');
    req.logout();
    req.session = null;
    res.clearCookie('token');
    return res.status(200).json({"signout": "success"})
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
    console.log("✅ postKakaoJsSignin at userController");
    const nickname = req.body.nickname;
    const { profileImg110, userid } = req.body;

    User.findOne({ id: userid})
    .exec(async(error, user) => {
        if(error) return res.status(400).json({error});
        if(user) {
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

export const getTokenFacebook = (req, res) => {
    console.log("getTokenFacebook");
    console.log(`req`, req);
}