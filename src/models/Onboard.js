import mongoose from "mongoose";

const onboardSchema = new mongoose.Schema({
    ticker: String,
    company: String,
    MarketCap: mongoose.Schema.Types.Decimal128,
    purchasePrice: String,
    share: Number,
    cost: mongoose.Schema.Types.Decimal128,
    date: { type: Date },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
});

const model = mongoose.model('Onboard', onboardSchema);

export default model;