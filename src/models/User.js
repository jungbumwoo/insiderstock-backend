import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
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
    ],
    bans: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Ban'}
    ]
})

const model = mongoose.model('User', userSchema);

export default model;