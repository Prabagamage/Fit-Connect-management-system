import mongoose from "mongoose";

const gymSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    services: { type: [String], required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    fees: { type: Number, required: true },
    ratings: { type: Number, default: 0 },
    images: { type: [String] },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

const Gym = mongoose.model("Gym", gymSchema);
export default Gym;
