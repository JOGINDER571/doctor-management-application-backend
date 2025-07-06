import jwt from "jsonwebtoken";

export const generateToken = (value: string, key: string) => {
  return jwt.sign(value, key);
};
