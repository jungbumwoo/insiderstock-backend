import puppeteer from "puppeteer";

export const stock = (req, res) => {
    console.log("stock controller");
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
        const tdTag = '#wrapper > div > table > tbody > tr > td'
        await page.waitForSelector(trTag);

        const isthere = await page.$$eval(trTag, trs => {
            let bucket = [];
            trs.forEach(tr => {
                    // bucket.push(tr.innerHTML);
                    let trTds = tr.querySelectorAll('td');
                    let trBucket = [];
                    trTds.forEach(td => {
                        let text;
                        text = td.innerText;
                        // let innerSpan = td.querySelector('span');
                        // let innerDiv = td.querySelector('div');
                        // if (innerSpan) {
                        //     text = innerSpan.innerText;
                        // } else if(innerDiv) {
                        //     text = innerDiv.innerText;
                        // } else {
                        //     text = "muyaho"
                        // }
                        trBucket.push(text);
                    })
                    bucket.push(trBucket);
                })
            return bucket; 
            }
        );
        return res.status(200).json({isthere});
    })
}