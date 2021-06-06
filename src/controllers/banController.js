import User from "../models/User.js";
import Ban from "../models/Ban.js";
import { pagedArray } from '../utils/pagination.js';

export const getBan = async(req, res) => {
    console.log("getBan");
    const { _id } = req.user;
    try {
        User.findOne({ _id }).populate('bans').exec((err, user) => {
            if(err) return res.status(400).json({ "message" : "Err at getBan"});
            if(user) {
                let bans = user.bans;
                let pagedBans = pagedArray(bans, req.query.page);
                return res.status(200).json({ data :pagedBans });
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
    
    // Document baned Date
    const banData = bandata.map((item) => {
        const nowDate = Date.now();
        const today = new Date(nowDate);
        item.createdAt = today.toISOString();
        return item
    });

    try {
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

export const deleteBan = async(req, res) => {
    const { deleteData } = req.body;
    const { _id } = req.user;
    console.log(`deleteData`, deleteData);
    const deleteIds = deleteData.map(item => item._id);
    console.log(`deleteIds`, deleteIds);
    try {
        await Ban.deleteMany({ _id: deleteIds })
        .exec((err, result) => {
            console.log(`Ban Delete result`, result);
        })
        await User.findOne({ _id })
        .exec((err, user) => {
            if (err) return  res.status(400).json({ "message" : "err at deleteBan"});
            if (user) {
                deleteIds.forEach(id => {
                    let index = deleteIds.indexOf(id);
                    user.bans.splice(index, 1);
                })
                user.save((err, user) => {
                    if (err) return res.status(400).json({ "message": "err at deleteBan"})
                    if (user) return res.status(201).json({ "message": "Keep Eyes on You, Hacker!!"});
                })
            }
        })
    } catch(err) {
        console.log(err)
    }
}