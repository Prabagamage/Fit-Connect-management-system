import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
    gymName: { type: String, required: true },
    challengeName: { type: String, required: true },
    challengeCategory: { type: String, required: true },
    challengeTimePeriod: { type: String, required: true },
    focusBodyParts: { type: String, required: true },
    fitnessBenefits: { type: String, required: true },
    explanation: { type: String, required: true },
    challengeImage: { type: String, required: true }, // Stores image URL
    workoutStepsImage: { type: String, required: true }, // Stores image URL
    workoutSteps: [
        {
            stepNo: Number,
            stepName: String,
            stepCount: Number,
            time: String,
            sets: Number
        }
    ],
    focus: { type: String, required: true },
    type: { type: String, required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    completedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    leaderboard: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            points: Number
        }
    ]
}, { timestamps: true });

const Challenge = mongoose.model("Challenge", challengeSchema);
export default Challenge;
