import mongoose from "mongoose";

const onboardSchema = new mongoose.Schema({
    ticker: String,
    company: String,
    marketCap: mongoose.Schema.Types.Decimal128,
    price: mongoose.Schema.Types.Decimal128,
    shares: Number,
    cost: mongoose.Schema.Types.Decimal128,
    date: { type: Date },
});

const model = mongoose.model('Onboard', onboardSchema);

export default model;