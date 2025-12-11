import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { Person } from "@/lib/types";

const DATA_FILE = path.join(process.cwd(), "data", "sample.json");

function readData(): { people: Record<string, Person>; rootIds: string[] } {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    return { people: {}, rootIds: [] };
  }
}

function writeData(data: { people: Record<string, Person>; rootIds: string[] }) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { personId } = req.query as { personId: string };

  const data = readData();
  if (!data.people) data.people = {};

  if (method === "GET") {
    const p = data.people[personId];
    if (!p) return res.status(404).json({ error: "not found" });
    return res.status(200).json({ person: p });
  }

  if (method === "PUT" || method === "PATCH") {
    const body = req.body;
    const existing = data.people[personId];
    if (!existing) return res.status(404).json({ error: "not found" });

    const updated: Person = {
      ...existing,
      ...body,
      id: personId
    };

    data.people[personId] = updated;
    writeData(data);
    return res.status(200).json({ person: updated });
  }

  if (method === "DELETE") {
    const existing = data.people[personId];
    if (!existing) return res.status(404).json({ error: "not found" });

    // Simple delete: remove from people and from other references
    delete data.people[personId];
    // Remove references from spouseIds and childIds
    Object.values(data.people).forEach((p) => {
      if (p.spouseIds) p.spouseIds = p.spouseIds.filter((id) => id !== personId);
      if (p.childIds) p.childIds = p.childIds.filter((id) => id !== personId);
    });

    writeData(data);
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", ["GET", "PUT", "PATCH", "DELETE"]);
  return res.status(405).end(`Method ${method} Not Allowed`);
}
