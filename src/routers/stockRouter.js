import express from "express";
import {  addGetInterest,
    addPostInterest,
     getAllStock, saveStock, 
    getOwnedStock, addInterest, 
    addOnboard, getSavedStock } from "../controllers/stockController2.js";
import { requireSignin } from "../middlewares.js";
const router = express.Router();

router.get('/stock', getAllStock);
router.get('/ownedstock', getOwnedStock);
router.post('/savestock', requireSignin, saveStock);

router.get('/stock/saved', requireSignin, getSavedStock);

router.get('/addinterest', addGetInterest);
router.post('/addinterest', requireSignin, addPostInterest);
router.post('/addonboard', addOnboard);


export default router;