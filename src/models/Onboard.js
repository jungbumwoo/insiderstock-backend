import mongoose from "mongoose";

const onboardSchema = new mongoose.Schema({
    ticker: String,
    company: String,
    MarketCap: mongoose.Schema.Types.Decimal128,
    price: mongoose.Schema.Types.Decimal128,
    share: Number,
    cost: mongoose.Schema.Types.Decimal128,
    date: { type: Date },
});

const model = mongoose.model('Onboard', onboardSchema);

export default model;