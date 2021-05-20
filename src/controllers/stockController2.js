import puppeteer from "puppeteer";
import User from "../models/User.js";
import Interest from "../models/Interest.js";
import Notinterest from "../models/Notinterest.js";
import jwt from "jsonwebtoken";

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
            console.log(buyresult.length);
            await browser.close();

            // if logged in, filter the NotInterest
            if(req.headers.authorization){
                let token = req.headers.authorization.split(" ")[1];
                const user = await jwt.verify(token, process.env.JWT_SECRET);
                User.findOne({ _id: user._id }).populate('notinterests').populate('bans').exec((err, user) => {
                    if(err) return res.status(400).json({ "message" : "err At getNotInterest"});;
                    if(user) {
                        console.log("notInterest at stockController");
                        let notInts = user.notinterests;
                        let bans = user.bans;
                        let notIntElement = notInts.map((el) => {
                            return {ticker: el.ticker, company: el.company}
                        });
                        let bansElement = bans.map((el) => {
                            return {ticker: el.ticker, company: el.company}
                        })
                        let totalexclude = notIntElement.concat(bansElement);
                        totalexclude.forEach((el) => {
                            buyresult.forEach((th) => {
                                while(true) {
                                    let idx = buyresult.indexOf(th);
                                    if(el.ticker == th[0] && el.company == th[2] && idx > -1) {
                                        buyresult.splice(idx, 1);
                                    } else {
                                        break;
                                    }
                                }
                            });
                        })
                    }
                    console.log(buyresult.length);
                    return res.status(200).json({ buyresult });
                })
            }
        } catch(err) {
            console.log(err)
        }
    })();
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

        if(dateDifference < 7) {
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

export const addGetInterest = async(req, res) => {
    const { _id } = req.user;
    try {
        let userData = User.findOne({ _id })
        .exec(async(err, user) => {
            let userIntId = user.interests; 
            let interested = await Interest.find({ _id: userIntId });
            return res.status(200).json({ interested });
        })
    } catch(err) {
        console.log(err);
        return res.status(400).json({ "message": err })
    }
}

export const addPostInterest = async(req, res) => {
    console.log("addPostInterest");
    let { data } = req.body;
    let { _id } = req.user;
    try {
        let result = await Interest.create(data);
        let resultDBId = result.map((item) => {
            return item._id
        })
        console.log("resultDBId");
        console.log(resultDBId);
        console.log(result);
        if(_id) {
            await User.findOne({ _id })
            .exec((err, user) => {
                if(err) {
                    console.log("Err at addPostInterest");
                    console.log(err);
                    return res.status(400).json({"message": "authoriztion err"});
                }
                if(user) {    
                    resultDBId.forEach((id) => {
                        user.interests.push(id);
                    })
                    user.save((err, user) => {
                        console.log(user);
                        return res.status(201).json({ result });
                    })
                }
            })
        } else {
            return res.status(400).json({"message": "authoriztion err"});
        }
    } catch(err) {
        console.log(err);
    }
}

export const deletePostInterest = async(req, res) => {
    let deleteinfo = req.body;
    let deleteIds = deleteinfo.map((item) => {
        return item._id;
    })
    let { _id } = req.user;
    try {
        let result = await Interest.deleteMany({ _id : deleteIds});
        console.log("deletePostInterest Result");
        console.log(result);
        await User.findOne({ _id })
        .exec((err, user) => {
            deleteIds.forEach((id) => {
                let index = user.interests.indexOf(id);
                user.interests.splice(index, 1);
            })
            user.save((err, user) => {
                if (err) res.status(400).json({ "message" : "err at deletePostInterest"});
                if (user) res.status(201).json({"message": "muyaho at deletePostInterst"});
            })
        })
    } catch(err) {
        console.log(err);
    }
}
