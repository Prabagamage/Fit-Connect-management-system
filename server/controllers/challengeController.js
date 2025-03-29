import Challenge from "../models/challengeModel.js";
import multer from "multer";
import fs from "fs";

// Set up Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = "uploads/";
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

export const upload = multer({ storage });

// Create Challenge
export const createChallenge = async (req, res) => {
    try {

        const { 
            gymName, 
            challengeName, 
            challengeCategory, 
            challengeTimePeriod, 
            focusBodyParts, 
            fitnessBenefits, 
            explanation, 
            workoutSteps: workoutStepsString, 
            focus, 
            type 
        } = req.body;

        // Parse workout steps
        let workoutSteps;
        try {
            workoutSteps = JSON.parse(workoutStepsString || '[]');
        } catch (parseError) {
            console.error('Error parsing workout steps:', parseError);
            return res.status(400).json({ message: "Invalid workout steps format" });
        }

        // Validate required files
        if (!req.files || !req.files["challengeImage"] || !req.files["workoutStepsImage"]) {
            return res.status(400).json({ message: "Challenge and Workout Steps images are required." });
        }

        // Create new challenge
        const newChallenge = new Challenge({
            gymName,
            challengeName,
            challengeCategory,
            challengeTimePeriod,
            focusBodyParts,
            fitnessBenefits,
            explanation,
            challengeImage: `/uploads/${req.files["challengeImage"][0].filename}`,
            workoutStepsImage: `/uploads/${req.files["workoutStepsImage"][0].filename}`,
            workoutSteps: workoutSteps.map((step, index) => ({
                stepNo: index + 1,
                stepName: step.stepName || '',
                stepCount: step.stepCount || 0,
                time: step.time || '',
                sets: step.sets || 0
            })),
            focus,
            type
        });

        // Save challenge
        await newChallenge.save();

        res.status(201).json(newChallenge);
    } catch (error) {
        console.error('Full Error in Challenge Creation:', error);
        res.status(500).json({ 
            message: "Internal Server Error", 
            error: error.message,
            stack: error.stack 
        });
    }
};

// Get all challenges
export const getChallenges = async (req, res) => {
    try {
        const challenges = await Challenge.find();
        res.status(200).json(challenges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get challenge by ID
export const getChallengeById = async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);
        if (!challenge) return res.status(404).json({ message: "Challenge not found." });
        res.status(200).json(challenge);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Challenge
export const updateChallenge = async (req, res) => {
    try {
        const updateData = req.body;
        if (req.files["challengeImage"]) updateData.challengeImage = `/uploads/${req.files["challengeImage"][0].filename}`;
        if (req.files["workoutStepsImage"]) updateData.workoutStepsImage = `/uploads/${req.files["workoutStepsImage"][0].filename}`;
        
        // Parse array fields
        if (req.body.workoutSteps) {
            updateData.workoutSteps = JSON.parse(req.body.workoutSteps);
        }
        if (req.body.participants) {
            updateData.participants = JSON.parse(req.body.participants);
        }
        if (req.body.completedUsers) {
            updateData.completedUsers = JSON.parse(req.body.completedUsers);
        }
        if (req.body.leaderboard) {
            updateData.leaderboard = JSON.parse(req.body.leaderboard);
        }


        const challenge = await Challenge.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json(challenge);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Challenge
export const deleteChallenge = async (req, res) => {
    try {
        await Challenge.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Challenge deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User Joins Challenge
export const joinChallenge = async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);
        if (!challenge) return res.status(404).json({ message: "Challenge not found." });

        if (!challenge.participants.includes(req.body.userId)) {
            challenge.participants.push(req.body.userId);
        }

        await challenge.save();
        res.status(200).json({ message: "User joined the challenge." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User Leaves Challenge
export const leaveChallenge = async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);
        challenge.participants = challenge.participants.filter(id => id.toString() !== req.body.userId);
        await challenge.save();
        res.status(200).json({ message: "User left the challenge." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Leaderboard
export const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await Challenge.find({}, "challengeName leaderboard").populate("leaderboard.userId", "name");
        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Complete Challenge & Assign Points
export const completeChallenge = async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);
        if (!challenge.completedUsers.includes(req.body.userId)) {
            challenge.completedUsers.push(req.body.userId);
            challenge.leaderboard.push({ userId: req.body.userId, points: 100 }); // Assign 100 points
        }

        await challenge.save();
        res.status(200).json({ message: "Challenge completed! Points assigned." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
