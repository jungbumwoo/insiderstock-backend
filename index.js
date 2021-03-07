import express from "express";
import dotenv from "dotenv";

// import "./src/db";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

express.json();

app.get('/', (req, res) => {
    res.send('Hello world');
})

app.listen(PORT, () => {
    console.log(`✅ Listening on at http://localhost:${process.env.PORT}`);
})