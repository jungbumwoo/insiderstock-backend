import express from "express";
import passport from "passport";
import { getLogin, 
    postLogin, 
    getToken, 
    getTokenFacebook, 
    getUser, 
    signout, 
    kakaoLogin,
    kakaoRestApi } from "../controllers/userController.js";
const router = express.Router();

router.get('/login', getLogin);
router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login'}),
    getTokenFacebook
);

router.get('/auth/kakao', passport.authenticate('kakao', {
    failureRedirect: '/login'
}), kakaoLogin);
router.get('/oauth', passport.authenticate('kakao', {
    failureRedirect: '/login'
}), getToken);

router.get('/auth/kakao/restapi', kakaoRestApi);

router.get('/auth/getuser', getUser);



router.get('/auth/signout', signout);

    // { successRedirect: 'http://localhost:3000',
    // failureRedirect: '/login'}
    

export default router;

