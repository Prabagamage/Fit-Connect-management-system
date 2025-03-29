import express from "express";
import { 
    createChallenge, getChallenges, getChallengeById, updateChallenge, deleteChallenge, 
    joinChallenge, leaveChallenge, getLeaderboard, completeChallenge, upload 
} from "../controllers/challengeController.js";

const challengeRouter = express.Router();

challengeRouter.post("/", upload.fields([{ name: "challengeImage" }, { name: "workoutStepsImage" }]), createChallenge);
challengeRouter.get("/", getChallenges);
challengeRouter.get("/:id", getChallengeById);
challengeRouter.put("/:id", upload.fields([{ name: "challengeImage" }, { name: "workoutStepsImage" }]), updateChallenge);
challengeRouter.delete("/:id", deleteChallenge);
challengeRouter.post("/:id/join", joinChallenge);
challengeRouter.post("/:id/leave", leaveChallenge);
challengeRouter.get("/leaderboard", getLeaderboard);
challengeRouter.post("/:id/complete", completeChallenge);

export default challengeRouter;
