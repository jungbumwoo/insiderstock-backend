import express, { response } from "express";
import cors from "cors";
import dotenv from "dotenv";

//router
import stockRouter from "./src/routers/stockRouter.js";
import userRouter from "./src/routers/userRouter.js";

import "./src/db";
import "./src/passport.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// express.json();
// express.urlencoded({ extended: true })

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use('/api', stockRouter);
app.use('/api', userRouter);


app.listen(PORT, () => {
    console.log(`✅ Listening on at http://localhost:${process.env.PORT}`);
})