import express from "express";
import { requireSignin } from "../middlewares";
import { getOnboard, postAddOnboard } from "../controllers/onboardController.js";

const router = express.Router();

router.get("/onboard", requireSignin, getOnboard);
router.post("/add/onboard", requireSignin, postAddOnboard);

export default router;