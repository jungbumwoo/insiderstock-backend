import express, { response } from "express";
import dotenv from "dotenv";

import axios from "axios";
import puppeteer from "puppeteer";


// import "./src/db";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

express.json();

app.get('/', (req, res) => {
    res.send('Hello world');
})
//https://hackernoon.com/a-guide-to-web-scraping-with-javascript-and-nodejs-i21l3te1

puppeteer
    .launch()
    .then (async browser => {
        console.log("muyaho");

        //opening a new page and navigating to Reddit
        const page = await browser.newPage();
        await page.goto('https://www.reddit.com/r/scraping/');
        await page.waitForSelector('body');

        //manipulating the page's content
        let grabPosts = await page.evaluate(() => {
            let allPosts = document.body.querySelectorAll('.Post');
                scrapeItems = [];
            console.log("allPost");
            console.log(allPosts);
            allPosts.forEach(item => {
                let postTitle = item.querySelector('h3').innerText;
                let postDescription = '';
                try {
                    postDescription = item.querySelector('p').innerText;
                } catch(err) {
                    console.log(err);
                }
                scrapeItems.push({
                    postTitle: postTitle,
                    postDescription: postDescription
                })
            });
            let items = {
                "redditPosts": scrapeItems,
            };
            return items;
        }); 
        console.log(grabPosts);
    })



app.listen(PORT, () => {
    console.log(`✅ Listening on at http://localhost:${process.env.PORT}`);
})