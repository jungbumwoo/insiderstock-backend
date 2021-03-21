import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
    ticker: String,
    company: String,
    price: String,
    insiderName: String,
    insiderPosition: String,
    date: { type: Date },
    buyOrSell: String,
    insiderTradingShares: String,
    sharesChange: String,
    price: mongoose.Schema.Types.Decimal128,
    cost: mongoose.Schema.Types.Decimal128,
    finalShare: Number,
    priceChangeSIT: { type: mongoose.Schema.Types.Decimal128 },
    DividendYield: mongoose.Schema.Types.Decimal128,
    PERatio: mongoose.Schema.Types.Decimal128,
    MarketCap: mongoose.Schema.Types.Decimal128,

    mydate: { type: Date },
    myprice: mongoose.Schema.Types.Decimal128
});

const model = mongoose.model('Stock', stockSchema);

export default model;