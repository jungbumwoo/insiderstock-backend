import express from "express";
import passport from "passport";
import { getLogin, postLogin } from "../controllers/userController.js";
const router = express.Router();

router.get('/login', getLogin);
router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/',
                                        failureRedirect: '/login'}));

export default router;

