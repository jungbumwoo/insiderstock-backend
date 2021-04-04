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
            await page.goto('https://www.gurufocus.com/insider/summary');
            
            // waitFor login Request and close(click) the request requirement
            // How about to use another Func?
            const selector = 'body > div.el-dialog__wrapper > div > div.el-dialog__header > button';
            await page.waitForSelector(selector);
            await page.click(selector);
            let today = getToday();
            let result = await getData(page, today);
            
            //pageNum
            const activePageTag = '#components-root > div > div.insider-page > div:nth-child(9) > div > ul > li.number.active';
            let pageNum = await page.$eval(activePageTag, num => num.innerText);

            //approach to next pages
            let pageNumInt = parseInt(pageNum);
            

            //only get "buy" data
            // let buyresult = buyfilter(finalresult);

            await browser.close();
            // return res.status(200).json({ buyresult });
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
    if (pageNum !== 1) {
        // go to next page
    }
    // Wait for data
    const trTag = '#wrapper > div > table > tbody > tr';
    await page.waitForSelector(trTag);

    // Get data from current Data
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
    totalList.concat(mainpage);
    let lastDataDate = mainpage[mainpage.length-1][6];
    let dateDifference = diffDate(today, lastDataDate);
    console.log(`Date Diff: ${dateDifference}`);

    if(dateDifference < 5){
        let nextpage = pageNum + 1;
        getData(page, today, nextpage, totalList);
    } else {
        return totalList;
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

export const addOnboard = (req, res) => {
    console.log(req.body.data);
}

export const addInterest = (req, res) => {
    console.log(req.body.data);
}