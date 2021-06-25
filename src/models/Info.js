import mongoose from "mongoose";

const infoSchema = new mongoose.Schema({
    ticker: { type: String, required: true},
    company: { type: String, required: true}, 
    insiderName: String,
    insiderPosition: String,
    date: { type: Date, required: true },
    transaction: { type: String, required: true},
    insiderTradingShares: String,
    sharesChange: String,
    purchasePrice: String,
    cost: String,
    finalShare: String,
    // price change since insider trade
    priceChangeSIT: { type: String },
    // DividendYield: String,
    PERatio: String,
    MarketCap: String,
    createdAt: { type: Date, default: Date.now }
});

const model = mongoose.model('Info', infoSchema);

export default model;