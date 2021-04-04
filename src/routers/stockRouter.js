import express from "express";
import { getAllStock, saveStock, getOwnedStock, addInterest, addOnboard } from "../controllers/stockController2";
const router = express.Router();

router.get('/stock', getAllStock);
router.get('/ownedstock', getOwnedStock);
router.post('/savestock', saveStock);
router.post('/addinterest', addInterest);
router.post('/addonboard', addOnboard);


export default router;