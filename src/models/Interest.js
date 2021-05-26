import mongoose from "mongoose";

const interestSchema = new mongoose.Schema({
    ticker: String,
    company: String,
    insiderName: String,
    insiderPosition: String,
    date: { type: Date },
    buyOrSell: String,
    insiderTradingShares: String,
    sharesChange: String,
    purchasePrice: String,
    finalShare: Number,
    // price change since insider trade
    priceChangeSIT: { type: mongoose.Schema.Types.Decimal128 },
    // DividendYield: mongoose.Schema.Types.Decimal128,
    PERatio: mongoose.Schema.Types.Decimal128,
    MarketCap: mongoose.Schema.Types.Decimal128,
    
    mydate: { type: Date },
    myprice: mongoose.Schema.Types.Decimal128
});

const model = mongoose.model('Interest', interestSchema);

export default model;