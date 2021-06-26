import express from "express";
import passport from "passport";
import { getLogin, 
    postLogin, 
    getToken, 
    getTokenFacebook, 
    getUser, 
    signout, 
    postKakaoJsSignin,
    postKakaoJsSignup,
    kakaoLoginCallback
 } from "../controllers/userController.js";
const router = express.Router();

// router.get('/auth/facebook', passport.authenticate('facebook'));
// router.get('/auth/facebook/callback',
//     passport.authenticate('facebook', { failureRedirect: '/login'}),
//     getTokenFacebook
// );

router.get('/login/kakao', passport.authenticate('kakao', {
    failureRedirect: '/signin'
}), getToken);

router.get('/oauth/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/signin'
}));

router.post('/auth/kakao/jslogin', postKakaoJsSignin);
router.post('/auth/kakao/signup', postKakaoJsSignup);

router.get('/auth/signout', signout);
    // { successRedirect: 'http://localhost:3000',
    // failureRedirect: '/login'}
export default router;

