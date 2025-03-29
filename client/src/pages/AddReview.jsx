import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthAxios from "../utils/AuthAxios";
import { FaStar } from "react-icons/fa";
import TopNav from '../components/TopNav';

const AddReview = () => {
  const { gymId } = useParams(); // to get gym id from the URL if needed
  const [gyms, setGyms] = useState([]);
  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [selectedGymId, setSelectedGymId] = useState(null); // Track selected gym's ID
  const [showDialog, setShowDialog] = useState(false);
  const [showReviews, setShowReviews] = useState(false); // New state for showing reviews
  const [reviews, setReviews] = useState([]); // Store reviews for the selected gym
  const [viewReviewsDialog, setViewReviewsDialog] = useState(false); // State to control view reviews dialog
  const [isUpdating, setIsUpdating] = useState(false); // New state to check if we're updating a review
  const [reviewToUpdate, setReviewToUpdate] = useState(null); // Store the review to be updated
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const response = await AuthAxios.get("/api/gyms");
        setGyms(response.data);
      } catch (error) {
        console.error("Error fetching gyms:", error);
      }
    };
    fetchGyms();
  }, []);

  const fetchReviews = async (gymId) => {
    try {
      const response = await AuthAxios.get(`/api/reviews/gym/${gymId}`);
      setReviews(response.data);
      setViewReviewsDialog(true); // Open reviews dialog when fetched
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userName || !comment || rating < 1 || !selectedGymId) {
      alert("Please fill out all fields");
      return;
    }

    try {
      if (isUpdating && reviewToUpdate) {
        // Update review
        await AuthAxios.put(`/api/reviews/${reviewToUpdate._id}`, {
          rating,
          comment,
        });
        alert("Review updated successfully!");
      } else {
        // Create new review
        await AuthAxios.post("/api/reviews/create", {
          user: userName,
          rating,
          comment,
          gymId: selectedGymId, // Use the selected gym ID
        });
        alert("Review added successfully!");
      }

      setShowDialog(false);
      fetchReviews(selectedGymId); // Refresh reviews after submitting or updating
      setIsUpdating(false); // Reset the update state
      setReviewToUpdate(null); // Reset review to update
    } catch (error) {
      console.error("Error adding/updating review:", error);
      alert("Failed to add/update review");
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await AuthAxios.delete(`/api/reviews/${reviewId}`);
      alert("Review deleted successfully!");
      fetchReviews(selectedGymId); // Refresh reviews after deleting
      navigate('/review-add'); // Redirect to /review-add page after deletion
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review");
    }
  };

  const handleUpdate = (review) => {
    setIsUpdating(true); // Set update mode
    setReviewToUpdate(review); // Set the review to be updated
    setUserName(review.user);
    setRating(review.rating);
    setComment(review.comment);
    setShowDialog(true); // Show the review form for updating
  };

  const renderStars = (currentRating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`cursor-pointer text-xl ${
          i < currentRating ? "text-yellow-500" : "text-gray-300"
        }`}
        onClick={() => setRating(i + 1)}
      >
        <FaStar />
      </span>
    ));
  };

  return (
    <>
      <TopNav />
      <div className="flex flex-row w-full h-screen">
        {/* Left Sidebar (Fixed) */}
        <div className="flex flex-col w-1/5 h-full">
          <div className="w-full bg-gray-300 p-10">
            <p className="text-3xl font-bold">Reviews</p>
          </div>
          <div className="w-full bg-gray-400 p-10 space-y-4 flex-1">
            <p
              className="text-2xl font-bold p-4 bg-gray-200 hover:bg-gray-300 cursor-pointer"
              onClick={() => navigate('/gym-list')}
            >
              Gym List
            </p>
            <p
              className="text-2xl font-bold p-4 bg-gray-200 hover:bg-gray-300 cursor-pointer"
              onClick={() => navigate('/review-add')}
            >
              Reviews
            </p>
          </div>
        </div>
        <div className="container mx-auto p-4 flex-1">
          <h2 className="text-2xl font-bold mb-4">Review List</h2>
          <div className="flex flex-col gap-4">
            {gyms.map((gym) => (
              <div key={gym._id} className="border-b py-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">{gym.name}</h3>
                  <div className="flex space-x-2">
                    <button
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      onClick={() => {
                        setSelectedGymId(gym._id); // Set the selected gym's ID
                        setShowDialog(true);
                      }}
                    >
                      Add Review
                    </button>
                    <button
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      onClick={() => fetchReviews(gym._id)} // Show reviews when clicked
                    >
                      View Reviews
                    </button>
                  </div>
                </div>
                {showDialog && selectedGymId === gym._id && (
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                      <h3 className="text-xl font-bold mb-4">
                        {isUpdating ? "Update Your Review" : "Write Your Review"}
                      </h3>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="userName" className="block text-sm font-medium">
                            Your Name
                          </label>
                          <input
                            type="text"
                            id="userName"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                            placeholder="Enter your name"
                          />
                        </div>
                        <div>
                          <label htmlFor="rating" className="block text-sm font-medium">
                            Rating
                          </label>
                          <div className="flex space-x-2">{renderStars(rating)}</div>
                        </div>
                        <div>
                          <label htmlFor="comment" className="block text-sm font-medium">
                            Your Comment
                          </label>
                          <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                            placeholder="Write your review here"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <button
                            type="button"
                            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                            onClick={() => setShowDialog(false)}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                          >
                            {isUpdating ? "Update Review" : "Submit Review"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Show reviews section */}
          {viewReviewsDialog && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-bold mb-4">Reviews</h3>
                <button
                  className="mt-4 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => setViewReviewsDialog(false)}
                >
                  Close Reviews
                </button>
                <div className="space-y-4 mt-4">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review._id} className="border p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">{review.user}</span>
                          <div className="flex space-x-1">{renderStars(review.rating)}</div>
                        </div>
                        <p className="mt-2">{review.comment}</p>
                        <div className="flex justify-between mt-2">
                          <button
                            onClick={() => handleDelete(review._id)} // Add delete functionality
                            className="text-red-500 hover:text-red-600"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handleUpdate(review)} // Add update functionality
                            className="text-blue-500 hover:text-blue-600"
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No reviews available for this gym.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddReview;
