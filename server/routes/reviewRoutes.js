import express from "express";
import { addReview, deleteReview, getReviewsByGymId, updateReview } from "../controllers/reviewController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, addReview);
router.delete("/:id", deleteReview);
router.get("/gym/:gymId", getReviewsByGymId);
router.put("/:id", updateReview);

export default router;
