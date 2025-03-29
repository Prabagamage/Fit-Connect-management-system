import { Router } from "express";
import { addCommentToDiscussion, createDiscussion, deleteDiscussion, getAllDiscussions, getAllDiscussionsByGym, getDiscussionById, getMyDiscussions, updateDiscussion } from "../controllers/discussionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const discussionRouter = Router()

discussionRouter.get("/all", getAllDiscussions)
discussionRouter.get("/:id", getDiscussionById)
discussionRouter.get("/",authMiddleware, getMyDiscussions)
discussionRouter.post("/create", authMiddleware, createDiscussion)
discussionRouter.get("/gym/:id", getAllDiscussionsByGym)
discussionRouter.delete("/:id", deleteDiscussion)
discussionRouter.put("/:id", authMiddleware, addCommentToDiscussion)
discussionRouter.patch("/:id", updateDiscussion)

export default discussionRouter