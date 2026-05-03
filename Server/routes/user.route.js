import express from "express";
import { login, logout, register, deleteUser } from "../controller/user.controller.js";
import { authUser, authSelfOrAdmin } from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.delete("/:userId", authSelfOrAdmin, deleteUser);

export default userRouter;