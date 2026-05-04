import userModel from "../model/user.model.js";
import musicModel from "../model/music.model.js";
import albumModel from "../model/album.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const register = async (req, res) => {
  try {
    const { username, email, password, role = 'user' } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter all credentials' })
    }

    const existingUser = await userModel.findOne({ $or: [{ username }, { email }] })

    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists' })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({ username, email, password: hash, role })

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET)

    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' })

    // Return user without password
    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    }

    return res.status(201).json({ success: true, message: 'User registered successfully', user: userData, token })
  } catch (error) {
    console.log('Registration Error :- ', error)
    return res.status(500).json({ success: false, message: 'Registration failed' })
  }
};

const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required' })
    }

    const user = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Wrong email or password' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Wrong email or password' })
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
    );

    res.cookie("token", token, { httpOnly: true, sameSite: 'lax' });

    // Return user without password
    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    }

    return res.status(200).json({ success: true, message: "Login successfully", user: userData, token });
  } catch (error) {
    console.log("login Error : ", error);
    return res.status(500).json({ success: false, message: 'Login failed' })
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true, sameSite: 'lax' });
    return res.status(200).json({ success: true, message: "Logout successfully" }); 
  } catch (error) {
    console.log("Logout Error : ", error);
    return res.status(500).json({ success: false, message: 'Logout failed' })
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Delete all songs by this user
    await musicModel.deleteMany({ artist: userId });

    // Delete all albums by this user
    await albumModel.deleteMany({ artist: userId });

    // Delete the user
    await userModel.findByIdAndDelete(userId);

    res.clearCookie("token", { httpOnly: true, sameSite: 'lax' });

    return res.status(200).json({ 
      success: true, 
      message: "User and all associated data deleted successfully" 
    });
  } catch (error) {
    console.log("Delete User Error : ", error);
    return res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};

export { register, login, logout, deleteUser };
