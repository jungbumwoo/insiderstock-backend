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