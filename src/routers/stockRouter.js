import express from "express";
import {  addGetInterest,
    addPostInterest,
    deletePostInterest,
     getAllStock
    } from "../controllers/stockController2.js";
import { addNotInterest, getNotInterest } from "../controllers/notInterestController.js";
import { requireSignin } from "../middlewares.js";
const router = express.Router();

router.get('/stock', getAllStock);

router.get('/addinterest', requireSignin, addGetInterest);
router.post('/addinterest', requireSignin, addPostInterest);

router.post('/addnotinterest', requireSignin, addNotInterest);

router.post('/delete/interest', requireSignin, deletePostInterest);
router.get('/getnotinterest', requireSignin, getNotInterest);


export default router;