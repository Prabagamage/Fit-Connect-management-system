import express from "express";
import { createGym, getGyms, getGymById, updateGym, deleteGym } from "../controllers/gymController.js";
import { upload } from "../controllers/challengeController.js";

const router = express.Router();

router.post("/create", upload.fields([{ name: "photo1", maxCount: 1 }, { name: "photo2", maxCount: 1 }, { name: "photo3", maxCount: 1 }]), createGym);
router.get("/", getGyms);
router.get("/:id", getGymById);
router.put("/:id", upload.fields([{ name: "photos", maxCount: 3 }]), updateGym);
router.delete("/:id", deleteGym);

export default router;
