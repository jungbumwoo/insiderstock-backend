import Stock from "../models/Stock.js";
import puppeteer from "puppeteer";
// 첫 페이지 뜨는 거 읽은 다음에 다음 페이지는 상황을 봐가며 읽던가 멈추던가 하는 방법이 있고
// 아에 처음부터 페이지를 돌리는데 상황을 보고 멈추는 방법도 있고.

export const getAllStock = (req, res) => {
    (async () => {
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

            //filter (Only for Buy Data)
            const buyresult = totalResult.filter(egg => egg[7] == 'Buy');
            await browser.close();
            return res.status(200).json({ buyresult });
        } catch(err) {
            console.log(err)
        }
    })();
    // .then(final => {
    //     console.log(final);
    //     return res.status(200).json({ final });
    // })
}

let getData = async(page, today, pageNum = 1, totalList = []) => {
    try {
        console.log(`getData Func page: ${page}, today: ${today}, pageNum: ${pageNum}`);
        if (pageNum !== 1) {
            // go to next page
            console.log("if nextpage")
            let changedUrl = `#components-root > div > div.insider-page > div.aio-tabs.hide-on-print.hidden-sm-and-down > div.el-pagination.el-pagination--small > ul > li:nth-child(${pageNum})` 
            // await page.waitForFunction(`(async(page) => {
            //     await page.$eval(changedUrl, li => li.click())
            // })()`, {}, page)
            // let activeNum = '#components-root > div > div.insider-page > div.aio-tabs.hide-on-print.hidden-sm-and-down > div.el-pagination.el-pagination--small > ul > li.number.active';
            await page.evaluate(x => {
                return document.querySelector(x).click();
            }, changedUrl);
            // await page.waitForFunction(
            //     `document.querySelector(${activeNum}).innerText.includes(${pageNum})`,
            //    );
            // page.waitForNavigation({ waitUntil: ['networkidle2'] })
            await page.waitForTimeout(2000);
            //     .then(() => console.log('Waited for click reload'));
            // await Promise.all([
            //     page.waitForNavigation({ waitUntil: ['networkidle0'] }),
            //     page.$eval(changedUrl, li => li.click())
            // ])
        };        
        // await page.evaluate(x => {
            //     console.log(`currentPage: ${x}`)
            // }, currentPage);
            // let currentPageText = await page.$eval(currentPage, (x)=> x.innerHTML);

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

        if(dateDifference < 5) {
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
    return diff;
}


export const saveStock = async(req, res) => {
    const { data } = req.body;
    console.log("saveStock at backend, req!");
    console.log(req);
    let newTypeData = data.reduce((acc, item) => {
        acc.push({
            ticker: item[0],
            company: item[2],
            currentprice: parseFloat(item[3].replace(/\$/g, '')),
            insiderName: item[4],
            insiderPosition: item[5],
            date: item[6],
            buyOrSell: item[7],
            insiderTradingShares: parseFloat(item[8].replace(/\,/, '')),
            sharesChange: parseFloat(item[9].replace(/\%/g, '')),
            purchasePrice: parseFloat(item[10].replace(/\$/g, '')),
            cost: parseFloat(item[11].replace(/\$|\,/g, '')),
            finalShare: parseInt(item[12].replace(/\,/g, '')),
            priceChangeSIT: parseFloat(item[13].replace(/\%/, '')),
            DividendYield: parseFloat(item[14]),
            PERatio: parseFloat(item[15]),
            MarketCap: parseFloat(item[16])
        })
        return acc
    }, []);
    let result = await Stock.create(newTypeData);
    let savedList = result.map((item) => {
        return { ticker : item.ticker, 
                company: item.company}
    })
    return res.status(200).json({ savedList });
};

export const getOwnedStock = (req, res) => {
    
}

export const addOnboard = (req, res) => {
    console.log(req.body.data);
}

export const addInterest = (req, res) => {
    console.log(req.body.data);
}