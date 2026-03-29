import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const register = async (req, res) => {
  try {
    const { username, email, password, role = "user" } = req.body;

    if (!username || !email || !password) {
      return res.json({
        success: false,
        message: "Please Enter All Credential",
      });
    }

    const isUserAlreadyExit = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserAlreadyExit) {
      return res.json({
        success: false,
        message: "User is Already Exists Please check the again email",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hash,
      role,
    });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
    );

    res.cookie("token", token);

    return res.json({ success: true, message: "User is register succesfully" });
  } catch (error) {
    console.log("Registration Error :- ", error);
  }
};

const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      return res.json({ success: false, message: "User is not exit" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.json({
        success: false,
        message: "Please enter the valid password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
    );

    res.cookie("token", token);

    return res.json({ success: true, message: "Login successfully", user });
  } catch (error) {
    console.log("login Erro : ", error);
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.json({ success: true, message: "Logout successfully" }); 
  } catch (error) {
    console.log("Logout Error : ", error);
  }
};
export { register, login, logout };
