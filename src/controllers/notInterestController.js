import Notinterest from "../models/Notinterest.js";
import User from "../models/User.js";

export const addNotInterest = async(req, res) => {
    console.log("addNotPostInterest");
    let { data } = req.body;
    let notInterest = data.map(el => {
        return {
            ticker: el.ticker,
            company: el.company,
            insiderName: el.insiderName
        }
    });
    let { _id } = req.user;
    try {
        let result = await Notinterest.create(notInterest);
        console.log(result);
        let resultDBId = result.map((item) => {
            return item._id
        })
        if(_id) {
            await User.findOne({ _id })
            .exec((err, user) => {
                if(err) return res.status(400).json({"message": "authoriztion err"});
                if(user) {    
                    resultDBId.forEach((id) => {
                        user.notinterests.push(id);
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

export const getNotInterest = async(req, res) => {
    console.log("getNotInterest");
    let { _id } = req.user;
    try {
        User.findOne({ _id }).populate('notinterests').exec((err, user) => {
            if(err) return res.status(400).json({ "message" : "err At getNotInterest"});;
            if(user) {
                let notInts = user.notinterests;
                console.log(notInts);
                return res.status(200).json({ notInterests: notInts });
            }
        })
    } catch(err){
        console.log(err)
    }
}

export const postDeleteNotInt = async(req, res) => {
    console.log("postDeleteNotInt");
    const { deleteArray } = req.body;
    const { _id } = req.user;
    const deleteDataID = deleteArray.map((item) => {
        return item._id;
    })
    console.log(deleteDataID);
    try {
        let result = await Notinterest.deleteMany({ _id : deleteDataID });
        let result2 = await User.findOne({ _id })
        .exec((err, user) => {
            deleteDataID.forEach((id) => {
                let index = user.notinterests.index;
                user.notinterests.splice(index, 1);
            })
            user.save((err, user) => {
                if (err) return res.status(400).json({ "message" : "err at PostDeleteNotInt"});
                if (user) return res.status(201).json({ "messgae" : "Muyaho at DeletePost"});
            })
        });
        console.log(result2);
        console.log(result2);
    } catch(err) {
        console.log(err);
        return res.status(400).json({ "message" : "err at PostDeleteNotInt"});
    }
}