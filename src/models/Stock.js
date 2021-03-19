import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
    ticker: String,
    company: String,
    price: 'string',
    insiderName: String,
    insiderPosition: String,
    date: { type: Date },
    buyOrSell: String,
    insiderTradingShares: String,
    sharesChange: String,
    price: Schema.Types.Decimal128,
    cost: Schema.Types.Decimal128,
    finalShare: Number,
    priceChangeSIT: { type: Schema.Types.Decimal128 },
    DividendYield: Schema.Types.Decimal128,
    PERatio: Schema.Types.Decimal128,
    MarketCap: Schema.Types.Decimal128,

    mydate: { type: Date },
    myprice: Schema.Types.Decimal128
});

export const Stock = mongoose.model('Stock', stockSchema);