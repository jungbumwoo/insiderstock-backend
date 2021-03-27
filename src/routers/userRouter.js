import express from "express";
import passport from "passport";
import { getLogin, postLogin, getToken, getUser } from "../controllers/userController.js";
const router = express.Router();

router.get('/login', getLogin);
router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/getuser', getUser);

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login'}),
    getToken
);

    // { successRedirect: 'http://localhost:3000',
    // failureRedirect: '/login'}
    

export default router;

