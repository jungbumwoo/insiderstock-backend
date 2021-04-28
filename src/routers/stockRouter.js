import express from "express";
import {  addGetInterest,
    addPostInterest,
    deletePostInterest,
     getAllStock, saveStock, 
    getOwnedStock, addOnboard, getSavedStock } from "../controllers/stockController2.js";
import { requireSignin } from "../middlewares.js";
const router = express.Router();

router.get('/stock', getAllStock);
router.get('/ownedstock', getOwnedStock);
router.post('/savestock', requireSignin, saveStock);

router.get('/stock/saved', requireSignin, getSavedStock);

router.get('/addinterest', requireSignin, addGetInterest);
router.post('/addinterest', requireSignin, addPostInterest);

router.post('/delete/interest', requireSignin, deletePostInterest);

router.post('/addonboard', addOnboard);


export default router;