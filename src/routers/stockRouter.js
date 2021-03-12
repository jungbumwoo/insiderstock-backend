import express from "express";
import { stock } from "../controllers/stockController";
const router = express.Router();

router.get('/stock', stock);

export default router;