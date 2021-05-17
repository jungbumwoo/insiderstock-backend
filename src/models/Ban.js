import mongoose from "mongoose";

const banSchema = new mongoose.Schema({
    ticker: String,
    company: String,
    createdAt: { type: Date, default: Date.now },
    DividendYield: mongoose.Schema.Types.Decimal128,
    PERatio: mongoose.Schema.Types.Decimal128,
    MarketCap: mongoose.Schema.Types.Decimal128,
});

const model = mongoose.model('Ban', banSchema);

export default model;