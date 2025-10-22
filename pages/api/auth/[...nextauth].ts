import { Auth, type AuthConfig } from "@auth/core";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import type { NextApiRequest, NextApiResponse } from "next";

const providers = [
  process.env.GITHUB_ID && process.env.GITHUB_SECRET
    ? GitHub({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET
      })
    : null,
  process.env.GOOGLE_ID && process.env.GOOGLE_SECRET
    ? Google({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET
      })
    : null
].filter((provider): provider is NonNullable<typeof provider> => Boolean(provider));

const authConfig: AuthConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  providers,
  pages: {
    signIn: "/login"
  }
};

export const config = {
  api: {
    bodyParser: false
  }
};

function headersToObject(headers: NextApiRequest["headers"]) {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (!value || typeof value === "undefined") {
      continue;
    }
    result[key] = Array.isArray(value) ? value.join(",") : value;
  }
  return result;
}

function readBody(req: NextApiRequest) {
  return new Promise<Buffer | undefined>((resolve, reject) => {
    if (req.method === "GET" || req.method === "HEAD") {
      resolve(undefined);
      return;
    }
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", (error) => reject(error));
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const protocol = (req.headers["x-forwarded-proto"] as string | undefined) ?? "http";
  const host = req.headers.host ?? "localhost:3000";
  const rawBody = await readBody(req);
  const body = rawBody ? new Uint8Array(rawBody) : undefined;

  const request = new Request(`${protocol}://${host}${req.url ?? ""}`, {
    method: req.method,
    headers: headersToObject(req.headers),
    body
  });

  const response = await Auth(request, authConfig);

  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      const existing = res.getHeader("Set-Cookie");
      if (existing) {
        res.setHeader("Set-Cookie", ([] as string[]).concat(existing as string | string[], value));
      } else {
        res.setHeader("Set-Cookie", value);
      }
    } else {
      res.setHeader(key, value);
    }
  });

  const responseBody = await response.text();
  res.status(response.status).send(responseBody);
}

