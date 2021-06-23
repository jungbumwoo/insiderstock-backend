import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import passport from "passport";
import session from 'express-session';

//router
import stockRouter from "./src/routers/stockRouter.js";
import userRouter from "./src/routers/userRouter.js";
import notInterestRouter from "./src/routers/notInterestRouter.js";
import onboardRouter from "./src/routers/onboardRouter.js";
import banRouter from "./src/routers/banRouter";

dotenv.config();
import "./src/db.js";
import "./src/passport.js";
import "./src/schedule/scheduleCollector.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'fasdvasd',
    resave: false,
    saveUninitialized: true,
    cookie: { sameSite: "none", secure: true}
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use('/api', stockRouter);
app.use('/api', userRouter);
app.use('/api', notInterestRouter);
app.use('/api', onboardRouter);
app.use('/api', banRouter);



app.listen(PORT, () => {
    console.log(`✅ Listening on at http://localhost:${process.env.PORT}`);
})