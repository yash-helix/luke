import mongoose from "mongoose";
const { Schema } = mongoose;

const FeedBackSchema = new Schema({
    text: {
        type: String,
    },
    userID: {
        type: String,
    },

});

export const feedbackModal = new mongoose.model('feedbackInfo', FeedBackSchema);