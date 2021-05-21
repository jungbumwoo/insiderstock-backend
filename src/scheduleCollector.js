import puppeteer from "puppeteer";
import schedule from "node-schedule";

import Info from "./models/Info.js";


schedule.scheduleJob('36 * * * *', () => {
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
        console.log(totalResult[0]);

        //filter (Only for Buy Data)
        await browser.close();

        let totalResultObject = totalResult.map(el => {
            return {
                ticker: el[0],
                company: el[2],
                currentprice: parseFloat(el[3].replace(/(\$|,)/g, '')),
                insiderName: el[4],
                insiderPosition: el[5],
                date: el[6],
                buyOrSell:el[7],
                insiderTradingShares: parseInt(el[8].replace(/,/g, "")),
                sharesChange: parseFloat(el[9].replace('%', '') ),
                purchasePrice: parseFloat(el[10].replace(/(\$|,)/g, '')),
                cost: parseFloat(el[11].replace(/(\$|,)/g, '')),
                finalShare: parseInt(el[12].replace(/,/g, "")),
                priceChangeSIT: parseFloat(el[13].replace('%', '')),
                DividendYield: parseFloat(el[14].replace('%', '')),
                PERatio: parseFloat(el[15].replace('%', '')),
                MarketCap: parseFloat(el[16].replace(/,/g, ""))
            }
        })

        await Info.create(totalResultObject);

        const buyresult = totalResult.filter(egg => egg[7] == 'Buy');
        console.log(buyresult.length);

        // if logged in, filter the NotInterest
        // if(req.headers.authorization){
        //     let token = req.headers.authorization.split(" ")[1];
        //     const user = await jwt.verify(token, process.env.JWT_SECRET);
        //     User.findOne({ _id: user._id }).populate('notinterests').populate('bans').exec((err, user) => {
        //         if(err) return res.status(400).json({ "message" : "err At getNotInterest"});;
        //         if(user) {
        //             console.log("notInterest at stockController");
        //             let notInts = user.notinterests;
        //             let bans = user.bans;
        //             let notIntElement = notInts.map((el) => {
        //                 return {ticker: el.ticker, company: el.company}
        //             });
        //             let bansElement = bans.map((el) => {
        //                 return {ticker: el.ticker, company: el.company}
        //             })
        //             let totalexclude = notIntElement.concat(bansElement);
        //             totalexclude.forEach((el) => {
        //                 buyresult.forEach((th) => {
        //                     while(true) {
        //                         let idx = buyresult.indexOf(th);
        //                         if(el.ticker == th[0] && el.company == th[2] && idx > -1) {
        //                             buyresult.splice(idx, 1);
        //                         } else {
        //                             break;
        //                         }
        //                     }
        //                 });
        //             })
        //         }
        //         console.log(buyresult.length);
        //         // return res.status(200).json({ buyresult });
        //     })
        // }
    } catch(err) {
        console.log(err)
    }
}

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

        if(dateDifference < 3) {
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