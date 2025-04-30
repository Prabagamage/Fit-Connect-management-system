import Review from "../models/Review.js";
import Gym from "../models/Gym.js";
import UserModel from "../models/User.js";

// Add Review
export const addReview = async (req, res) => {
  try {
    const { rating, comment, gymId } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userDoc = await UserModel.findById(req.user.id);
    if (!userDoc) {
      return res.status(404).json({ message: "User not found" });
    }
    const review = new Review({ userId: req.user.id, user: userDoc.name, rating, comment, gym: gymId });
    await review.save();

    const gyms = await Gym.findById(gymId).populate('reviews');

    gym.reviews.push(review._id);

    // Update Gym Rating
    const gym = await Gym.findById(gymId);
    gym.reviews.push(review._id);
    gym.ratings = (gym.ratings + rating) / 2; // Calculate average rating
    await gym.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch Reviews by Gym ID
export const getReviewsByGymId = async (req, res) => {
  try {
    const { gymId } = req.params; // Get gymId from request parameters
    const reviews = await Review.find({ gym: gymId }).populate('gym', 'name'); // Populate gym name in the reviews

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this gym" });
    }

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete Review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Remove review from Gym
    await Gym.findByIdAndUpdate(review.gym, { $pull: { reviews: review._id } });

    res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Review
export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    console.log(req.body)
    const { id } = req.params;

    // Find the review by ID
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Update the review
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    // Save the updated review
    await review.save();

    // Update Gym Rating (Recalculate the average rating)


    await gym.save();
    res.status(200).json(review);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: error.message });
  }
};
