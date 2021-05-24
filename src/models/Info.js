import mongoose from "mongoose";

const infoSchema = new mongoose.Schema({
    ticker: String,
    company: String,
    currentprice: String,
    insiderName: String,
    insiderPosition: String,
    date: { type: Date },
    transcation: String,
    insiderTradingShares: String,
    sharesChange: String,
    purchasePrice: String,
    cost: String,
    finalShare: String,
    // price change since insider trade
    priceChangeSIT: { type: String },
    DividendYield: String,
    PERatio: String,
    MarketCap: String,
});

const model = mongoose.model('Info', infoSchema);

export default model;