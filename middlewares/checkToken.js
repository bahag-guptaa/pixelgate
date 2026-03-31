import jwt from "jsonwebtoken";

export const checkToken = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json("Access denied. No token provided.");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json("Invalid token.");
    }
    req.token = decoded.id;
    next();
  } catch (error) {
    return res.status(500).json("Error verifying token.");
  }
};
