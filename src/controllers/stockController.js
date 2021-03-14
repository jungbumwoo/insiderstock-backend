import puppeteer from "puppeteer";

// 첫 페이지 뜨는 거 읽은 다음에 다음 페이지는 상황을 봐가며 읽던가 멈추던가 하는 방법이 있고
// 아에 처음부터 페이지를 돌리는데 상황을 보고 멈추는 방법도 있고.

export const stock = (req, res) => {
    puppeteer
    .launch()
    .then(async browser => {
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
        let finalList = loopPage(pageNumInt, mainpage);
        return res.status(200).json({ finalList });
    })
}

const nextpage = async (pageNumber, waitsecond = 500) => {
    let newpageNum = parseInt(pageNumber) + 1;
    // let newpageNumString = String(newpageNum);
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://www.gurufocus.com/insider/summary');

        const trTag = '#wrapper > div > table > tbody > tr';
        await page.waitForSelector(trTag);
        await page.evaluate(x => {
            console.log(x); //Why doesn't this work?
            document.querySelector(`#components-root > div > div.insider-page > div.aio-tabs.hide-on-print.hidden-sm-and-down > div.el-pagination.el-pagination--small > ul > li:nth-child(${x})`).click()
        }, newpageNum);
        await page.waitForTimeout(waitsecond);
        let isLoading = await page.$('nuxt-progress');
        if (!isLoading) {
            console.log(`nextpage Function excuted with pageNumber ${newpageNum}`);
            const anotherPage = await page.$$eval(trTag, trs => {
                let bucket = [];
                trs.forEach(tr => {
                        console.log(tr);
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
            return anotherPage;
        } else {
            console.log('Loading now..');
            nextpage(pageNumber, waitsecond + 1000);
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

const loopPage = async(pageNum, existList) => {
    console.log(`loopPage with pageNum: ${pageNum}`);
    let nextpagelist = await nextpage(pageNum);
    let addedList = await existList.concat(nextpagelist);

    let today = getToday();
    let pastDate = nextpagelist[nextpagelist.length -1][6];
    let dateDiff = diffDate(today, pastDate);

    if (pageNum < 2) {
        loopPage(pageNum + 1, addedList);
    } else {
        console.log("addedList")
        console.log(addedList);
        return addedList;
    }
};