import express from "express";
import { requireSignin } from "../middlewares";
import { postAddOnboard } from "../controllers/onboardController.js";

const router = express.Router();

router.post("/add/onboard", requireSignin, postAddOnboard);

export default router;