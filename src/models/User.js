import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    id: String,
    provider: String,
    onboards: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Onboard'}
    ],
    interests: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Interest'}  
    ],
    notinterests: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Notinterest'}
    ]
})

const model = mongoose.model('User', userSchema);

export default model;