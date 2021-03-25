import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    id: String
    
})

const model = mongoose.model('User', userSchema);

export default model;