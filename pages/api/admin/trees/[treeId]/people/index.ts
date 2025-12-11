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

  if (method === "GET") {
    const data = readData();
    // Return as array for convenience
    const peopleArray = Object.values(data.people || {});
    return res.status(200).json({ people: peopleArray, rootIds: data.rootIds || [] });
  }

  if (method === "POST") {
    const body = req.body;
    if (!body || !body.name) {
      return res.status(400).json({ error: "name is required" });
    }

    const data = readData();
    const id = body.id ?? `p-${Date.now()}`;
    const newPerson: Person = {
      id,
      name: String(body.name),
      birthYear: body.birthYear ?? undefined,
      deathYear: body.deathYear ?? undefined,
      spouseIds: Array.isArray(body.spouseIds) ? body.spouseIds : [],
      childIds: Array.isArray(body.childIds) ? body.childIds : []
    };

    data.people = data.people || {};
    data.people[id] = newPerson;
    writeData(data);

    return res.status(201).json({ person: newPerson });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${method} Not Allowed`);
}
