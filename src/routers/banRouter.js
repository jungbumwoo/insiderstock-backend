import express from "express";
import { requireSignin } from "../middlewares";
import { getBan, postAddBan, deleteBan} from "../controllers/banController";

const router = express.Router();

router.get('/ban', requireSignin, getBan);
router.post('/addban', requireSignin, postAddBan);
router.post('/ban/delete', requireSignin, deleteBan);

export default router;