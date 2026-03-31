import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerNewUser = async (req, res) => {
  const { nickname, email, password } = req.body;
  if (!nickname || !email || !password) {
    return res.status(400).json("Missing required fields");
  }
  try {
    const verufyEmail = await User.findOne({ where: { email } });
    if (verufyEmail) {
      return res.status(400).json("Email already in use");
    }
    const verifyNickname = await User.findOne({ where: { nickname } });
    if (verifyNickname) {
      return res.status(400).json("Nickname already in use");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      nickname,
      email,
      password: hashedPassword,
    });
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json("Error registering user");
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("Missing required fields");
  }
  try {
    const verifyUser = await User.findOne({ where: { email } });
    if (!verifyUser) {
      return res.status(400).json("Invalid email or password");
    }

    const verifyPassword = await bcrypt.compare(password, verifyUser.password);
    if (!verifyPassword) {
      return res.status(400).json("Invalid email or password");
    }

    const token = jwt.sign({ id: verifyUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    return res.status(500).json("Error logging in user");
  }
};

export const getCurrentUser = async (req, res) => {
  const id = req.token;
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(404).json("User not found");
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json("Error fetching user");
  }
};
