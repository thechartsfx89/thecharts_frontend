// lib/auth.ts
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export type DecodedToken = {
  id: string;
  role: string;
  exp: number;
};

export function authenticate(req: NextApiRequest, res: NextApiResponse, roles?: string[]) {
  try {
    const token = req.cookies["accessToken"];

    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    if (roles && !roles.includes(decoded.role)) {
      res.status(403).json({ error: "Forbidden" });
      return null;
    }

    return decoded;
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
    return null;
  }
}
