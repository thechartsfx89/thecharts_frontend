// File: /pages/api/register.ts
import type { NextApiRequest, NextApiResponse } from "next";
import apiService from "@/lib/axios";
import { UserLoginRes } from "@/types/user";
import { API_ENDPOINTS } from "@/api-constant";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    try {
        // const { username, email, password } = req.body;

        const response = await apiService.post<UserLoginRes>(
            API_ENDPOINTS.register,
            // { data: req.body }
        );

        // Forward Strapi cookies (JWT/session) to browser
        if (response.headers["set-cookie"]) {
            res.setHeader("Set-Cookie", response.headers["set-cookie"]);
        }

        res.status(200).json(response.data);
    } catch (err: any) {
        const message =
            err.response?.data?.error?.message || "Something went wrong";
        res.status(err.response?.status || 400).json({ error: message });
    }
}
