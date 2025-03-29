import CommentModel from "../models/Comment.js";
import DiscussionModel from "../models/Discussion.js";
import { ERROR_RESPONSE, SUCCESS_RESPONSE } from "../utils/helper.js";


export const createDiscussion = async (req, res) => {
    try {
        const u = req.user;

        const user = u?.id;
        const { gym, title, description, name, email, mobile } = req.body;

        if (!user) return ERROR_RESPONSE(res, 401, "Unauthorized");

        if (!title || !description) return ERROR_RESPONSE(res, 400, "Missing required fields");

        const createdDiscussion = await DiscussionModel.create({ gym: gym ? gym : null, title, description, user: user, comments: [], name, email, mobile });


        return SUCCESS_RESPONSE(res, 201, { message: "Discussion created successfully!", discussion: createdDiscussion });
    } catch (error) {
        return ERROR_RESPONSE(res, 500, error.message);
    }
}

export const getAllDiscussionsByGym = async (req, res) => {
    try {
        const { gym } = req.params.id
        if (!gym) return ERROR_RESPONSE(res, 400, "Missing required fields");
        const discussions = await DiscussionModel.find({ gym }).populate("gym").populate("user").populate("comments");
        return SUCCESS_RESPONSE(res, 200, { discussions });
    } catch (error) {
        return ERROR_RESPONSE(res, 500, error.message);
    }
}

export const getDiscussionById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return ERROR_RESPONSE(res, 400, "Missing required fields");
        const discussion = await DiscussionModel.findById(id).populate("gym").populate("user").populate("comments");
        return SUCCESS_RESPONSE(res, 200, { discussion });
    } catch (error) {
        return ERROR_RESPONSE(res, 500, error.message);
    }
}

export const deleteDiscussion = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return ERROR_RESPONSE(res, 400, "Missing required fields");
        const discussion = await DiscussionModel.findByIdAndDelete(id);
        return SUCCESS_RESPONSE(res, 200, { message: "Discussion deleted successfully!", discussion });
    } catch (error) {
        return ERROR_RESPONSE(res, 500, error.message);
    }
}

export const addCommentToDiscussion = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;
        if (!id || !comment || !req.user) return ERROR_RESPONSE(res, 400, "Missing required fields");

        const commentC = await CommentModel.create({ comment, user: req.user, discussion: id });


        const discussion = await DiscussionModel.findById(id);
        discussion.comments.push(commentC._id);
        await discussion.save();
        return SUCCESS_RESPONSE(res, 200, { message: "Comment added successfully!" });
    } catch (error) {
        return ERROR_RESPONSE(res, 500, error.message);
    }
}


export const updateDiscussion = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return ERROR_RESPONSE(res, 400, "Missing required fields");

        const { title, description } = req.body;
        const discussion = await DiscussionModel.findByIdAndUpdate(id, { title, description }, { new: true });
        return SUCCESS_RESPONSE(res, 200, { discussion });
    } catch (error) {
        return ERROR_RESPONSE(res, 500, error.message);
    }
}

export const getMyDiscussions = async (req, res) => {
    try {
        const { id } = req.user;
        if (!id) return ERROR_RESPONSE(res, 400, "Missing required fields");
        const discussions = await DiscussionModel.find({ user: id }).populate("gym").populate("user").populate("comments");
        return SUCCESS_RESPONSE(res, 200, { discussions });
    } catch (error) {
        return ERROR_RESPONSE(res, 500, error.message);
    }
}


export const getAllDiscussions= async (req, res) => {
    try {
        const discussions = await DiscussionModel.find().populate("gym").populate("user").populate("comments");
        return SUCCESS_RESPONSE(res, 200, { discussions });
    } catch (error) {
        console.log(error)
        return ERROR_RESPONSE(res, 500, error.message);
    }
}
