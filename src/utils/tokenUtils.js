import {env} from "~/config/environment";
import jwt from "jsonwebtoken";
const generateAccessToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: "15m"
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: "1d"
  });
};

const generateUUID = () => {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 12).padStart(12, 0)
  );
};

export const generateToken = {
  generateAccessToken,
  generateRefreshToken,
  generateUUID
};
