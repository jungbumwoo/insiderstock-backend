import puppeteer from "puppeteer";
import schedule from "node-schedule";
import Info from "../models/Info.js";
import Interest from "../models/Interest.js";
import Onboard from "../models/Onboard.js";

import { deleteData } from "./deleteScheduler.js";

schedule.scheduleJob('* * 10 * * *', () => {
    deleteData();
    collectData();
});

const collectData = async() => {
    console.log('what the what!!');
    try {
        console.log("getAllStock Func executed");
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://www.gurufocus.com/forum/login.php?0');
        
        // Login
        await page.waitForSelector('#txt-username');
        await page.type('#txt-username', process.env.GURU_ID);
        await page.type('#txt-password', process.env.GURU_PASSWORD);

        //submit
        await page.click('#login_form > div > table > tbody > tr:nth-child(3) > td > input');
        console.log("Login GURU submit");
        await page.waitForSelector('#menu > li:nth-child(5) > div > div > ul > li:nth-child(1) > a');
        await page.evaluate(() => document.querySelector('#menu > li:nth-child(5) > div > div > ul > li:nth-child(1) > a').click());
        await page.waitForNavigation();
        let today = getToday();

        //GET DATA
        let totalResult = await getData(page, today);
        await browser.close();

        // make Data to object with key
        let totalResultObject = totalResult.map(el => {
            return {
                ticker: el[0],
                company: el[2],
                // currentprice: el[3],
                insiderName: el[4],
                insiderPosition: el[5],
                date: el[6],
                transaction: el[7],
                insiderTradingShares: el[8],
                sharesChange: el[9],
                purchasePrice: el[10],
                cost: el[11],
                finalShare: el[12],
                priceChangeSIT: el[13],
                DividendYield: el[14],
                PERatio: el[15],
                MarketCap: el[16]
            }
        });

        // prepare for comparing with DB data
        let briefGetData = totalResultObject.map((item) => {
            return {
                ticker: item.ticker,
                company: item.company,
                insiderName: item.insiderName,
                date: item.date,
                transaction: item.transaction,
                cost: item.cost,
                insiderTradingShares: item.insiderTradingShares
            };
        });

        // Get DB data
        let exsistInfo = await Info.find({}).exec()
        .then(async(info) => {
            if(info){
                //  reform for compare with New Data.
                let briefInfo = info.map((item) => {
                    let reformDate = reformDataType(item.date);
                    return {
                        ticker: item.ticker,
                        company: item.company,
                        insiderName: item.insiderName,
                        date: reformDate,
                        transaction: item.transaction,
                        cost: item.cost,
                        insiderTradingShares: item.insiderTradingShares
                    }
                });
                console.log(`${briefGetData.length} were collected.(briefGetData.length)`);
                console.log(`${briefInfo.length} was in db. (briefInfo)`);

                console.log(`briefGetData[0]`, briefGetData[0]);
                console.log(`briefInfo[0]`, briefInfo[0]);

                // Deduplication and sort the New one.
                let dupliBriefGetData = briefGetData.slice();
                dupliBriefGetData.forEach((item) => {
                    let i = 0;
                    while(i < briefInfo.length){
                        if(JSON.stringify(item) == JSON.stringify(briefInfo[i])) {
                            let index = briefGetData.indexOf(item);
                            briefGetData.splice(index, 1);
                            break;
                        }
                        i++;
                    }
                })

                console.log("After deduplication");
                console.log(`briefGetData[1]`, briefGetData[1]);
                console.log(`briefGetData.length`, briefGetData.length);
                // let sort = briefGetData.filter(item => )

                // Get "Buy" Data from New Data
                const newBuyResult = briefGetData.filter(egg => egg.transaction == 'Buy');
                console.log(`newBuyResult.length`, newBuyResult.length);
                console.log(`newBuyResult[0]`, newBuyResult[0]);
                
                // Get "Sell" Data from New Data
                const newSellResult = briefGetData.filter(egg => egg.transaction == 'Sell');
                console.log(`newSellResult.length`, newSellResult.length);
                console.log(`newSellResult[1]`, newSellResult[1]);

                // Get "Sell" Data from exsist Data
                const exsistSellInfo = briefInfo.filter(egg => egg.transaction == 'Sell');
                console.log(`exsistSellInfo.length`, exsistSellInfo.length);
                console.log(`exsistSellInfo[0]`, exsistSellInfo[0]);

                // all onboard + interest Data
                let onboards = await Onboard.find({});
                let interests = await Interest.find({});

                let exsistOnIns = onboards.concat(interests);

                console.log(`onboards`, onboards);
                console.log(`interests`, interests);



                // 새로 들어온 거에서 ticker, company 동일한거 있으면 따로 빼서 저장해줘야함.
                let important = [];
                newSellResult.forEach(item => {
                    let tickercompany = {
                        ticker: item.ticker,
                        company: item.company
                    };
                    let i = 0;
                    while(i < exsistOnIns.length) {
                        let abc = {
                            ticker: exsistOnIns[i].ticker,
                            company: exsistOnIns[i].company
                        };
                        if(JSON.stringify(abc) === JSON.stringify(tickercompany)) {
                            important.push(item);
                            break;
                        };
                        i++
                    }
                });

                console.log(`important.length`, important.length);
                console.log(`important[0]`, important[0]);

                // newBuyResult + important
                const total = newBuyResult.concat(important);

                let dataResult = total.map(item => {
                    let index = briefGetData.indexOf(item);
                    return totalResultObject[index];
                })

                console.log(`dataResult.length`, dataResult.length);

                return dataResult;
            }
        })
        .then((dataResult) => {
            if(dataResult.length > 0) {
                Info.create(dataResult);
                console.log("✅ updated executed.");
            } else {
                return;
            }
            console.log("✅ collection func executed. succeeded");
            return;
        })
    } catch(err) {
        console.log(err);
    }
}

// collectData();

let getData = async(page, today, pageNum = 1, totalList = []) => {
    try {
        console.log(`getData Func page: ${page}, today: ${today}, pageNum: ${pageNum}`);
        if (pageNum !== 1) {
            // go to next page
            console.log("if nextpage");
            let changedUrl = '';
            if(pageNum < 10) {
                changedUrl = `#components-root > div > div.insider-page > div.aio-tabs.hide-on-print.hidden-sm-and-down > div.el-pagination.el-pagination--small > ul > li:nth-child(${pageNum})`;
            } else {
                changedUrl = `#components-root > div > div.insider-page > div.aio-tabs.hide-on-print.hidden-sm-and-down > div.el-pagination.el-pagination--small > ul > li:nth-child(6)`;
            }

            await page.evaluate(x => {
                return document.querySelector(x).click();
            }, changedUrl);
            
            await page.waitForTimeout(2000);
        };        
     
        const trTag = '#wrapper > div > table > tbody > tr';
        await page.waitForSelector(trTag);

        // Get data from current Data
        let mainpage = await page.$$eval(trTag, trs => {
            let bucket = [];
            trs.forEach(tr => {
                    // bucket.push(tr.innerHTML);
                    let trTds = tr.querySelectorAll('td');
                    let trBucket = [];
                    trTds.forEach(td => {
                        let text;
                        text = td.innerText;
                        trBucket.push(text);
                    })
                    bucket.push(trBucket);
                })
                return bucket;
            }
        );
        let resultArray = totalList.concat(mainpage);
        let lastDataDate = mainpage[mainpage.length-1][6];
        let dateDifference = diffDate(today, lastDataDate);
        console.log(`Date Diff: ${dateDifference}`);

        if(dateDifference < 10) {
            let nextpage = pageNum + 1;
            return await getData(page, today, nextpage, resultArray);
        } else {
            return resultArray;
        }
    } catch(err) {
        console.log(err);
    }
    // date caculate and return or recursive
};

const getToday = () => {
    let timeNow = new Date();
    let year = timeNow.getFullYear();
    let month = ("0" + (1 + timeNow.getMonth())).slice(-2);
    let day = ("0" + timeNow.getDate()).slice(-2);
    
    return year + '-' + month + '-' + day;
}

const diffDate = (day1, day2) => {
    let strDay1 = day1.split('-');
    let strDay2 = day2.split('-');
    
    let date1 = new Date(strDay1[0], strDay1[1] -1, strDay1[2]);
    let date2 = new Date(strDay2[0], strDay2[1] -1, strDay2[2]);

    let diff = (date1 - date2) / (1000*60*60*24); 
    if(diff > 20){
        console.log(`Today: ${date1}`);
        console.log(`Last Data Date: ${date2}`);
    }
    return diff;
}

const reformDataType = (date) => {
    let year = date.getFullYear();
    let month = (1 + date.getMonth());
    month = month >= 10 ? month : '0' + month;
    let day = date.getDate();
    day = day >= 10 ? day : '0' + day;
    return year + '-' + month + '-' + day; 
}

//🔥