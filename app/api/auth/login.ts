import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { identifier, password } = req.body;

    const response = await axios.post(`${process.env.STRAPI_URL}/api/auth/local`, {
      identifier,
      password,
    }, {
      withCredentials: true,
    });

    // Forward cookies from Strapi to browser
    res.setHeader("Set-Cookie", response.headers["set-cookie"] || []);
    res.status(200).json(response.data);
  } catch (err: any) {
    res.status(401).json({ error: "Invalid login" });
  }
}
