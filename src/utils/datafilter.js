export const filterData = async(buydata, selldata, personalData) => {
    try {
        // seperate user's populatedData
        let perOnboard = personalData.onboards;
        let perInterests = personalData.interests;
        let perBans = personalData.bans;
        let perNotinterests = personalData.notinterests;

        let excludeData = [
            ...perBans,
            ...perNotinterests
        ];
        
        let onboardsAndInterests = [
            ...perOnboard,
            ...perInterests
        ];

        console.log(`buydata.length`, buydata.length)

        // sort the not get "Baned", "NotInterest" data from "buydata"
        let copiedBuydata = buydata;
        excludeData.forEach((el) => {
            for(let i=0; i< copiedBuydata.length; i++) {
                if(el.ticker == copiedBuydata[i].ticker && el.company == copiedBuydata[i].company) {
                    let index = buydata.indexOf(copiedBuydata[i]);
                    buydata.splice(index, 1);
                }
            }
        });
        console.log('if there is difference, it means sorted');
        console.log(`buydata.length`, buydata.length);

        // mark the data if user is interested or onboard.
        for(let i=0; i < onboardsAndInterests.length; i++) {
            for(let j=0; j< buydata.length; j++) {
                if(onboardsAndInterests[i].ticker == buydata[j].ticker && onboardsAndInterests[i].company == buydata[j].company) {
                    console.log(`🟢 additional purchase 🟢 ${buydata[j].ticker}, ${buydata[j].company}`);
                    buydata[j]['notification'] = true;                
                }
            }        
        };

        // sort the data from sell data. if it's interested or onboard/
        let sortFromSell = [];
        onboardsAndInterests.forEach((el) => {
            selldata.forEach((item) => {
                if(el.ticker == item.ticker && el.company == item.company) {
                    console.log(`📞 Sell detected 📞 ${item.ticker}, ${item.company}`)
                    sortFromSell.push(item);
                }
            })
        });

        let filtered = [
            ...sortFromSell,
            ...buydata
        ];

        return filtered;
    } catch(err) {  
        console.log(err);
    }
}