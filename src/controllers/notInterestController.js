import Notinterest from "../models/Notinterest.js";
import User from "../models/User.js";

export const addNotInterest = async(req, res) => {
    console.log("addNotPostInterest");
    let { data } = req.body;
    console.log(data);
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
        let resultDBId = result.map((item) => {
            return item._id
        })
        console.log("resultDBId");
        console.log(resultDBId);
        console.log(result);
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
                console.log("notInterest at getNotInterest at notInterestController.js");
                let notInts = user.notinterests;
                console.log(notInts);
                return res.status(200).json({ notInterests: notInts });
            }
        })
        
    } catch(err){
        console.log(err)
    }
}

