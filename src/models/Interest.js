import mongoose from "mongoose";

const interestSchema = new mongoose.Schema({
    ticker: String,
    company: String,
    insiderName: String,
    insiderPosition: String,
    date: { type: Date },
    transcation: String,
    insiderTradingShares: String,
    sharesChange: String,
    purchasePrice: String,
    finalShare: String,
    // price change since insider trade
    priceChangeSIT: String,
    // DividendYield: String,
    PERatio: String,
    MarketCap: String,
    
    mydate: { type: Date },
    myprice: String
});

const model = mongoose.model('Interest', interestSchema);

export default model;