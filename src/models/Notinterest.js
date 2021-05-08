import mongoose from "mongoose";

const notinterestSchema = new mongoose.Schema({
    ticker: String,
    company: String,
    insiderName: String,
    MarketCap: mongoose.Schema.Types.Decimal128,
    date: { type: Date, default: Date.now },
});

const model = mongoose.model('Notinterest', notinterestSchema);

export default model;