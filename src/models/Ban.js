import mongoose from "mongoose";

const banSchema = new mongoose.Schema({
    ticker: String,
    company: String,
    createdAt: { type: Date, default: Date.now },
    // DividendYield: mongoose.Schema.Types.Decimal128,
    PERatio: String,
    MarketCap: String,
});

const model = mongoose.model('Ban', banSchema);

export default model;