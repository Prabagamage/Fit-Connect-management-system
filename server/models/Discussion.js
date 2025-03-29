import mongoose from "mongoose";

const discussionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    gym: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gym",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    name: {
        type: String,
    },
    email: {
        type: String,
    },
    mobile: {
        type: String,
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
}, {
    timestamps: true
});

const DiscussionModel = mongoose.model("Discussion", discussionSchema);
export default DiscussionModel