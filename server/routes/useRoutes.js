import { Router } from "express";
import { loginUser, registerUser } from "../controllers/userController.js";

const userRouter = Router()

userRouter.post('/login', loginUser)
userRouter.post('/register', registerUser)

export default userRouter