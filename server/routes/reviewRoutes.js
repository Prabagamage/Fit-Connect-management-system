import express from "express";
import { addReview, deleteReview, getReviewsByGymId, updateReview } from "../controllers/reviewController.js";

const router = express.Router();

router.post("/create", addReview);
router.delete("/:id", deleteReview);
router.get("/gym/:gymId", getReviewsByGymId); 
router.put("/:id", updateReview);

export default router;
