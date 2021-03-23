import express from "express";
import { getAllStock, saveStock, getOwnedStock } from "../controllers/stockController";
const router = express.Router();

router.get('/stock', getAllStock);
router.get('/ownedstock', getOwnedStock);
router.post('/savestock', saveStock);


export default router;