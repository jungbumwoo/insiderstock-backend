import express from "express";
import { getAllStock, saveStock, getOwnedStock, addInterest, addOnboard } from "../controllers/stockController2";
import { requireSignin } from "../middlewares";
const router = express.Router();

router.get('/stock', getAllStock);
router.get('/ownedstock', getOwnedStock);
router.post('/savestock', requireSignin, saveStock);
router.post('/addinterest', addInterest);
router.post('/addonboard', addOnboard);


export default router;