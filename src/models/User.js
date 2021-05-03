import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    id: String,
    provider: String,
    saves: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Save'}
    ],
    onboards: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Onboard'}
    ],
    interests: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Interest'}  
    ],
    notinterests: [
        { type: mongoose.Schema.Types.ObjectId, res: 'Notinterest'}
    ]
})

const model = mongoose.model('User', userSchema);

export default model;