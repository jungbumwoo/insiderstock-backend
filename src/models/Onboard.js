import mongoose from "mongoose";

const onboardSchema = new mongoose.Schema({
    ticker: { type: String, required: true },
    company: { type: String, required: true },
    MarketCap: String,
    price: { type: String, required: true },
    shares: { type: String, required: true },
    cost: String,
    date: { type: Date , default: Date.now()},
});

const model = mongoose.model('Onboard', onboardSchema);

export default model;