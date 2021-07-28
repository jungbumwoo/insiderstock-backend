import express from "express";
import passport from "passport";
import { requireSignin } from "../middlewares";
import { getLogin, 
    postLogin, 
    getToken, 
    getTokenFacebook, 
    getUser, 
    signout, 
    postKakaoJsSignin,
    postKakaoJsSignup,
    kakaoLoginCallback,
    handleToken
 } from "../controllers/userController.js";
const router = express.Router();

router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login'}),
    getTokenFacebook
);

router.get('/login/kakao', passport.authenticate('kakao', {
    failureRedirect: '/signin'
}), getToken);

router.get('/oauth/kakao/callback',
    passport.authenticate('kakao', { failureRedirect: '/signin'}),
    kakaoLoginCallback
);

router.get('/oauth/kakao',
    passport.authenticate('kakao', { failureRedirect: '/signin'}),
    kakaoLoginCallback
);

router.post('/auth/kakao/jslogin', postKakaoJsSignin);
router.post('/auth/kakao/signup', postKakaoJsSignup);

router.post('/auth/token', handleToken);

router.get('/auth/signout', signout);
    // { successRedirect: 'http://localhost:3000',
    // failureRedirect: '/login'}
export default router;

