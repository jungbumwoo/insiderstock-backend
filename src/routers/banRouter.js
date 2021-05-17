import express from "express";
import { requireSignin } from "../middlewares";
import { getBan, postAddBan } from "../controllers/banController";

const router = express.Router();

router.get('/ban', requireSignin, getBan);
router.post('/addban', requireSignin, postAddBan);

export default router;