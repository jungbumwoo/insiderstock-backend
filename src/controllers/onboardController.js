import Onboard from "../models/Onboard.js";
import User from "../models/User.js";

export const postAddOnboard = async (req, res) => {
    const { onboardList} = req.body;
    const { _id } = req.user;

    console.log(onboardList);

    // {} => [{}, {}, {}, ... {}]
    let onboardItems = [];
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
    console.log(`onboardItems`, onboardItems);
    // Object => Array
    // let arrayOnboard = Object.values(onboardList);

    // Split the Array by stock
    // let onboardArray = [];
    // let arrayNum = arrayOnboard.length;
    // for(let i = 0; i < arrayNum/6; i++) {
    //     let removed = arrayOnboard.splice(0, 6);
    //     onboardArray.push(removed);
    // }

    // transform to save
    // let onboardObj = onboardArray.map(el => {
    //     return {
    //         ticker: el[0],
    //         company: el[1],
    //         price: el[2],
    //         shares: parseInt(el[3]),
    //         cost: el[2] * parseInt(el[3]),
    //         marketCap: parseFloat(el[5])
    //     }
    // });
    // Save in MongoDB
    try {
        // let result = await Onboard.create(onboardList);
        // let resultDBId = result.map((item) => {
        //     return item._id
        // });
        
        // if(_id) {
        //     await User.findOne({ _id })
        //     .exec((err, user) => {
        //         if(err) return res.status(400).json({"message" : "authoriztion err"});
        //         if(user) {
        //             resultDBId.forEach((id) => {
        //                 user.onboards.push(id);
        //             })
        //             user.save((err, user) => {
        //                 console.log("result at postAddOnboard");
        //                 console.log(result);
        //                 return res.status(201).json({ result });
        //             })
        //         } else {
        //             return res.status(400).json({"message" : "authoriztion err"});
        //         }
        //     })
        // }
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
                return res.status(200).json({ onboards: onboardList });
            }
        })
    } catch(err) {
        console.log(err);
        return res.status(400).json({ "message" : "getOnboard Err"});
    }
};