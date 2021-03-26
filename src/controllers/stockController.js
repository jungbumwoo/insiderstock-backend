import Stock from "../models/Stock.js";
import puppeteer from "puppeteer";
// 첫 페이지 뜨는 거 읽은 다음에 다음 페이지는 상황을 봐가며 읽던가 멈추던가 하는 방법이 있고
// 아에 처음부터 페이지를 돌리는데 상황을 보고 멈추는 방법도 있고.

export const getAllStock = (req, res) => {
    (async () => {
        try {
            console.log("stock func executed");
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto('https://www.gurufocus.com/insider/summary');
            
            const selector = 'body > div.el-dialog__wrapper > div > div.el-dialog__header > button';
            await page.waitForSelector(selector);
            await page.click(selector);
            
            const trTag = '#wrapper > div > table > tbody > tr';
            const activePageTag = '#components-root > div > div.insider-page > div:nth-child(9) > div > ul > li.number.active';
            await page.waitForSelector(trTag);
            
            let pageNum = await page.$eval(activePageTag, num => num.innerText);
            const mainpage = await page.$$eval(trTag, trs => {
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
            let pageNumInt = parseInt(pageNum);
            let finalresult = await loopPage(pageNumInt, mainpage, page);
            let buyresult = buyfilter(finalresult);

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


const nextpage = async (pageNumber, waitsecond = 5000, page) => {
    let newpageNum = pageNumber + 1
    let changedUrl = `#components-root > div > div.insider-page > div.aio-tabs.hide-on-print.hidden-sm-and-down > div.el-pagination.el-pagination--small > ul > li:nth-child(${newpageNum})`
    // let newpageNumString = String(newpageNum);
    try {
        // const browser = await puppeteer.launch();
        // const page = await browser.newPage();
        // await page.goto('https://www.gurufocus.com/insider/summary');

        const trTag = '#wrapper > div > table > tbody > tr';
        await page.waitForSelector(trTag);
        // await page.evaluate(x => {
        //     // console.log(x); //Why doesn't this work?
        //     document.querySelector(`#components-root > div > div.insider-page > div.aio-tabs.hide-on-print.hidden-sm-and-down > div.el-pagination.el-pagination--small > ul > li:nth-child(${x})`).click()
        // }, newpageNum);
        await page.$eval(changedUrl, li => li.click());
        await page.waitForTimeout(waitsecond);
        let isLoading = await page.$('nuxt-progress');
        if (!isLoading) {
            console.log(`nextpage Function excuted with pageNumber ${newpageNum}`);
            const anotherPage = await page.$$eval(trTag, trs => {
                let bucket = [];
                trs.forEach(tr => {
                        console.log(tr); // 이 줄은 왜 실행안됨????
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
            console.log(anotherPage[anotherPage.length - 1][0]);
            return anotherPage;
        } else {
            console.log('Loading now..');
            nextpage(pageNumber, waitsecond + 1000, page);
        }  
    } catch(error) {
        console.log(error);
    }
}

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

const loopPage = async (pageNum, existList, page) => {
    try {
        console.log(`loopPage with pageNum: ${pageNum}`);
        if (pageNum == 2) {
            console.log('loop will end');
            let finalLoopPageList = existList;
            console.log(finalLoopPageList[finalLoopPageList.length -1][0]);
            return finalLoopPageList;
        } else {
            let nextpagelist = await nextpage(pageNum, 5000, page);
            let addedList = existList.concat(nextpagelist);
            let today = getToday();
            // let pastDate = nextpagelist[nextpagelist.length -1][6];
            // let dateDiff = diffDate(today, pastDate);
            console.log('loopPage will excute again');
            return await loopPage(pageNum + 1, addedList);
        }
    } catch(error) {
        console.log(error);
    }
};

const buyfilter = (list) => {
    const result = list.filter(tr => tr[7] == "Buy");
    return result
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