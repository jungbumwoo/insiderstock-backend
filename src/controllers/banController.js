import User from "../models/User.js";
import Ban from "../models/Ban.js";

export const getBan = async(req, res) => {
    console.log("getBan");
    const { _id } = req.user;
    try {
        User.findOne({ _id }).populate('bans').exec((err, user) => {
            if(err) return res.status(400).json({ "message" : "Err at getBan"});
            if(user) {
                let bans = user.bans;
                return res.status(200).json({ ban: bans})
            }
        })
    } catch(err) {
        console.log(err);
        return res.status(400).json({ "message" : "Err at getBan"});
    }
};

export const postAddBan = async(req, res) => {
    const { _id } =  req.user;
    const { bandata } =  req.body;
    try {
        let banData = bandata.map((item) => {
            return {
                ticker: item[0],
                company: item[2],
                // DividendYield: item[14],
                PERatio: item[15],
                MarketCap: item[16]
            }
        });
        let result = await Ban.create(banData);
        let resultDBId = result.map((item) => {
            return item._id
        })
        if(_id) {
            await User.findOne({ _id })
            .exec((err, user) => {
                if(err) return res.status(400).json({ "message" : "auth err"});
                if(user) {
                    resultDBId.forEach((id) => {
                        user.bans.push(id);
                    })
                    user.save((err, user) => {
                        console.log("✅ banned ")
                        return res.status(201).json({ result });
                    })
                }
            })
        } else {
            return res.status(400).json({ "message": "err at banController"});
        }
    } catch(err) {
        console.log(err);
        return res.status(400).json({ "message": "err at banController"});
    }
}

