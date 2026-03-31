import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    if (users.length === 0) {
      return res.status(404).json("No users found");
    }
    res.json(users);
  } catch (error) {
    return res.status(500).json("Error fetching users");
  }
};

export const createUser = async (req, res) => {
  const { nickname, email, password } = req.body;
  if (!nickname || !email || !password) {
    return res.status(400).json("Missing required fields");
  }
  try {
    const newUser = await User.create({ nickname, email, password });
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json("Error creating user");
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json("User not found");
    }
    res.json(user);
  } catch (error) {
    return res.status(500).json("Error fetching user");
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nickname, email, password, bio } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json("User not found");
    }
    user.nickname = nickname || user.nickname;
    user.email = email || user.email;
    user.password = password || user.password;
    user.bio = bio || user.bio;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json("Error updating user");
  }
};

export const addFavouriteGame = async (req, res) => {
  const { gameId } = req.body;
  const id = req.token;
  try {
    // add game id check
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(404).json("User not found");
    }
    const verifyGame = user.favourites?.includes(Number(gameId));
    if (verifyGame) {
      return res.status(400).json("Game already in favorites");
    }
    user.favourites = [...(user.favourites || []), Number(gameId)];
    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Error adding favorite game");
  }
};

export const removeFavouriteGame = async (req, res) => {
  const { gameId } = req.body;
  const id = req.token;
  try {
    // add game id check
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(404).json("User not found");
    }
    const verifyGame = user.favourites?.includes(Number(gameId));
    if (!verifyGame) {
      return res.status(400).json("Game not in favorites");
    }
    user.favourites = user.favourites.filter((id) => id !== Number(gameId));
    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json("Error removing favorite game");
  }
};
