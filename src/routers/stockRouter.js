import express from "express";
import { getAllStock, saveStock } from "../controllers/stockController";
const router = express.Router();

router.get('/stock', getAllStock);

router.post('/savestock', saveStock);

export default router;