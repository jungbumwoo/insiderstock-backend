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

console.log("muyaho");

puppeteer
    .launch()
    .then(async browser => {
        const page = await browser.newPage();
        await page.goto('https://www.gurufocus.com/insider/summary');

        const selector = 'body > div.el-dialog__wrapper > div > div.el-dialog__header > button';
        await page.waitForSelector(selector);
        await page.click(selector);

        const tbodyTag = '#wrapper > div > table > tbody';
        const trTag = '#wrapper > div > table > tbody > tr';
        await page.waitForSelector(trTag);

        const isthere = await page.$$eval(trTag => {
            console.log("trTag");
            console.log(trTag);
            let innerContents = [];
            trTag.forEach(tr => {
                let trBucket = {}; // []
                tr.forEach(td => {
                    let text;
                    let tdBucket = {};
                    let content = td.querySelector('span');
                    if (content) {
                        console.log("content");
                        console.log(content);
                        text = content.innerText;
                    } else {
                        text = "muyaho";
                    }
                    trBucket.push(tdBucket);
                })
            innerContents.push(trBucket);
            })
            return innerContents;
        });
        console.log(isthere);
        await browser.close();
        // close Pop-up
        // const closePopupBtn = await page.$("el-dialog__headerbtn");
        // console.log("closePopupBtn");
        // console.log(closePopupBtn);
    })

// puppeteer
//     .launch()
//     .then (async browser => {
//         console.log("muyaho");

//         //opening a new page and navigating to Reddit
//         const page = await browser.newPage();
//         await page.goto('https://www.reddit.com/r/scraping/');
//         await page.waitForSelector('body');

//         //manipulating the page's content
//         let grabPosts = await page.evaluate(() => {
//             let allPosts = document.body.querySelectorAll('.Post');
//                 scrapeItems = [];
//             console.log("allPosts");
//             console.log(allPosts);
//             allPosts.forEach(item => {
//                 let postTitle = item.querySelector('h3').innerText;
//                 let postDescription = '';
//                 try {
//                     postDescription = item.querySelector('p').innerText;
//                 } catch(err) {
//                     console.log(err);
//                 }
                
//                 scrapeItems.push({
//                     postTitle: postTitle,
//                     postDescription: postDescription
//                 })
//             });
//             let items = {
//                 "redditPosts": scrapeItems,
//             };
//             return items;
//         }); 
//         console.log(grabPosts);
//     })



app.listen(PORT, () => {
    console.log(`✅ Listening on at http://localhost:${process.env.PORT}`);
})