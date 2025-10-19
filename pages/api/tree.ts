import type { NextApiRequest, NextApiResponse } from "next";
import sample from "@/data/sample.json";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name } = req.query;

  if (name && name !== "sample") {
    return res.status(404).json({ message: "Tree not found" });
  }

  res.status(200).json(sample);
}
