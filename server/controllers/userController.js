import UserModel from "../models/User.js";
import { ERROR_RESPONSE, SUCCESS_RESPONSE } from "../utils/helper.js";
import jwt from "jsonwebtoken";


export const loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email: email });
        if (!user) return ERROR_RESPONSE(res, 404, "User not found!");

        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) return ERROR_RESPONSE(res, 401, "Invalid password!");

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "1d" });

        return SUCCESS_RESPONSE(res, 200, { user, token, message: "Login successful!" });
    }catch(err){
        return ERROR_RESPONSE(res, 500, err.message);
    }
}

export const registerUser = async (req, res) => {
    try{
        const { name, email, password } = req.body;
        const isExist = await UserModel.findOne({ email: email });
        if (isExist) return ERROR_RESPONSE(res, 400, "User already exists!");
        const user = new UserModel({ name, email, password });
        await user.save();
        return SUCCESS_RESPONSE(res, 201, {
            message: "User registered successfully!",
            user
        });
    }catch(err){
        return ERROR_RESPONSE(res, 500, err.message);
    }
}