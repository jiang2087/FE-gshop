import { decodeJwt, JWTPayload, jwtVerify } from "jose";

export const JWT_COOKIE_NAME = "accessToken";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not set");
}

const secretKey = new Uint8Array(
  Buffer.from(jwtSecret, "base64")
);

export type AppJwtPayload = JWTPayload & {
  sub: string;
  roles?: { authority: string }[];
};

export async function verifyToken(token: string): Promise<AppJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });
    return payload as AppJwtPayload;
  } catch {
    return null;
  }
}

export function decodeTokenUnsafe(token: string): AppJwtPayload | null {
  try {
    return decodeJwt(token) as AppJwtPayload;
  } catch {
    return null;
  }
}
