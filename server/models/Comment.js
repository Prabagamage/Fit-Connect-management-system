import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    discussion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Discussion",
        required: true
    }
}, {
    timestamps: true
});

const CommentModel = mongoose.model("Comment", commentSchema);
export default CommentModel
