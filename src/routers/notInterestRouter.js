import express from "express";
import { postDeleteNotInt } from "../controllers/notInterestController";
import { requireSignin } from "../middlewares";

const router = express.Router();

router.post("/delete/notinterest", requireSignin, postDeleteNotInt);

export default router;