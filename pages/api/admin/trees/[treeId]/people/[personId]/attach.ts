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

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  const body = req.body as { targetId?: string; relation?: string };
  if (!body || !body.targetId || !body.relation) {
    return res.status(400).json({ error: "targetId and relation required" });
  }

  const data = readData();
  const source = data.people[personId];
  const target = data.people[body.targetId];
  if (!source || !target) return res.status(404).json({ error: "source or target not found" });

  const relation = body.relation;

  if (relation === "spouse") {
    source.spouseIds = Array.from(new Set([...(source.spouseIds || []), target.id]));
    target.spouseIds = Array.from(new Set([...(target.spouseIds || []), source.id]));
  } else if (relation === "child") {
    source.childIds = Array.from(new Set([...(source.childIds || []), target.id]));
    // no parent field on Person; keep children lists authoritative
  } else if (relation === "parent") {
    target.childIds = Array.from(new Set([...(target.childIds || []), source.id]));
  } else {
    return res.status(400).json({ error: "invalid relation" });
  }

  data.people[personId] = source;
  data.people[body.targetId] = target;
  writeData(data);

  return res.status(200).json({ ok: true, source, target });
}
