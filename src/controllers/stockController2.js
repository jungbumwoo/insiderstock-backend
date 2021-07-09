import User from "../models/User.js";
import Interest from "../models/Interest.js";
import Info from "../models/Info.js";
import jwt from "jsonwebtoken";

import { pagedArray } from "../utils/pagination.js";

// 첫 페이지 뜨는 거 읽은 다음에 다음 페이지는 상황을 봐가며 읽던가 멈추던가 하는 방법이 있고
// 아에 처음부터 페이지를 돌리는데 상황을 보고 멈추는 방법도 있고.

export const getAllStock = async(req, res) => {
    try {
        // if logged in, filter the NotInterest
        if(req.headers.authorization){
            let token = req.headers.authorization.split(" ")[1];
            const user = await jwt.verify(token, process.env.JWT_SECRET);
            await Info.find({ transaction: "Buy"})
            .exec((err, infos) => {
                // transform for pagination
                console.log(`infos.length`, infos.length);
                let paginatedResult = pagedArray(infos, req.query.page);
                console.log(paginatedResult.pager.currentPage);
                return res.status(200).json({paginatedResult});
            })
        } else {
            //withOut Logged In
            let infos = await Info.find({ transaction: "Buy"}).exec();
            console.log("infos at getAllStock! * without * Login");

            let reverseInfos = infos.reverse();

            // transform for pagination
            let paginatedResult = pagedArray(reverseInfos, req.query.page);
            console.log(paginatedResult.pager.currentPage);
            return res.status(200).json({paginatedResult});
        }
    } catch(err) {
        console.log(err);
        return res.status(400).json({ err });
    };
};

export const getInterest = async(req, res) => {
    const { _id } = req.user;
    console.log("addgetInterest");
    try {
        let userData = User.findOne({ _id })
        .exec(async(err, user) => {
            let userIntId = user.interests;
            let interested = await Interest.find({ _id: userIntId });
            let pagedGetInt = pagedArray(interested, req.query.page);
            return res.status(200).json({ pagedGetInt });
        })
    } catch(err) {
        console.log("err at addgetInterest");
        console.log(err);
        return res.status(400).json({ "message": err })
    }
}

export const addPostInterest = async(req, res) => {
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

    // conditions
    let tickerArray = deleteinfo.map((item) => {
        return item.ticker
    });
    let insiderArray = deleteinfo.map((item) => {
        return item.insiderTradingShares
    });
    let fShareArray = deleteinfo.map((item) => {
        return item.finalShare
    });
    let { _id } = req.user;
    try {
        // find by conditions
        let result = await Interest.find({
            $and: [
                { ticker: { $in : tickerArray}}, //ticker
                { insiderTradingShares: { $in : insiderArray}}, //insiderName
                { finalShare: {$in : fShareArray}}, //trading share
            ]
        });

        // delete data's Id
        let deleteIds = result.map((item) => {
            return item._id;
        })  
        await Interest.deleteMany({ _id : deleteIds});
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
