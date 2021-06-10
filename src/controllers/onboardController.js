import Onboard from "../models/Onboard.js";
import User from "../models/User.js";
import { pagedArray } from "../utils/pagination.js";

export const postAddOnboard = async (req, res) => {
    const { onboardList } = req.body;
    const { filledInOneData } = req.body;
    console.log(`req.body`, req.body);
    const { _id } = req.user;

    
    let onboardItems = [];
    if (onboardList) {
        console.log(`onboardList`, onboardList);
        // {} => [{}, {}, {}, ... {}]
        Object.entries(onboardList).forEach(([key, value]) => {
            // 'num_onboard_key' => num, _, key
            let splitItem = key.split('_');
            let num = parseInt(splitItem[0]); // num
            let itemKey = splitItem[2];  // key

            // Generate {}.
            if(!onboardItems[`${num}`]) {
                onboardItems[`${num}`] = {};
            }
            
            // Insert key and value in {}
            onboardItems[`${num}`][`${itemKey}`] = value;
        }) 
    } else if (filledInOneData) {
        console.log(`filledInOneData`, filledInOneData);
        onboardItems = filledInOneData;
    }
    
    console.log(`onboardItems`, onboardItems);

    // Save in MongoDB
    try {
        let result = await Onboard.create(onboardItems);

        if (!result.length) {
            console.log("result is object!");
            result = [result];
        } 
        
        console.log(`result`, result);

        let resultDBId = result.map((item) => {
            return item._id
        });
        
        if(_id) {
            await User.findOne({ _id })
            .exec((err, user) => {
                if(err) return res.status(400).json({"message" : "authoriztion err"});
                if(user) {
                    resultDBId.forEach((id) => {
                        user.onboards.push(id);
                    })
                    user.save((err, user) => {
                        console.log("result at postAddOnboard");
                        console.log(result);
                        return res.status(201).json({ result });
                    })
                } else {
                    return res.status(400).json({"message" : "authoriztion err"});
                }
            })
        }
    } catch(err) {
        console.log(err);
        res.status(400).json({ "message" : "error at postAddOnboard"});
    }
}

export const getOnboard = (req, res) => {
    const { _id } = req.user;
    try {
        User.findOne({ _id }).populate('onboards')
        .exec((err, user) => {
            if(err) return res.status(400).json({ "message" : "Error!!"})
            if(user) {
                let onboardList = user.onboards;
                let pagedOnboard = pagedArray(onboardList, req.query.page);
                return res.status(200).json({ pagedOnboard });
            }
        })
    } catch(err) {
        console.log(err);
        return res.status(400).json({ "message" : "getOnboard Err"});
    }
};

export const deleteOnboard = async(req, res) => {
    const { onboards } = req.body;
    const { _id } = req.user;
    const deleteDataId = onboards.map(item => item._id);
    try {
        await Onboard.deleteMany({ _id: deleteDataId});
        await User.findOne({ _id })
        .exec((err, user) => {
            deleteDataId.forEach(id =>{
                let index = user.onboards.indexOf(id);
                user.onboards.splice(index, 1);
            })
            user.save((err, user) => {
                if (err) return res.status(400).json({"message" : "err at PostDelete"});
                if (user) return res.status(201).json({ "message" : "Muyaho at deleteOnboard"});
            })
        })
    } catch(err) {
        console.log(err);
        return res.status(400).json({ "message" : "err at DeleteOnboard"});
    }
}