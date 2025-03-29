import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    user: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    gym: { type: mongoose.Schema.Types.ObjectId, ref: "Gym", required: true },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
