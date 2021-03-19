import express, { response } from "express";
import cors from "cors";
import dotenv from "dotenv";

//router
import stockRouter from "./src/routers/stockRouter.js";

import "./src/db";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

express.json();


app.use(cors());
app.use('/api', stockRouter);


app.listen(PORT, () => {
    console.log(`✅ Listening on at http://localhost:${process.env.PORT}`);
})