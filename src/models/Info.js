import mongoose from "mongoose";

const infoSchema = new mongoose.Schema({
    ticker: String,
    company: String,
    currentprice: mongoose.Schema.Types.Decimal128,
    insiderName: String,
    insiderPosition: String,
    date: { type: Date },
    buyOrSell: String,
    insiderTradingShares: Number,
    sharesChange: mongoose.Schema.Types.Decimal128,
    purchasePrice: mongoose.Schema.Types.Decimal128,
    cost: mongoose.Schema.Types.Decimal128,
    finalShare: Number,
    // price change since insider trade
    priceChangeSIT: { type: mongoose.Schema.Types.Decimal128 },
    DividendYield: mongoose.Schema.Types.Decimal128,
    PERatio: mongoose.Schema.Types.Decimal128,
    MarketCap: mongoose.Schema.Types.Decimal128,
});

const model = mongoose.model('Info', infoSchema);

export default model;