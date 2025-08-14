import "server-only";
import { EncryptJWT, jwtDecrypt, jwtVerify, SignJWT } from "jose";

export type SessionData = {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  [key: string]: any;
};

const SIGNING_SECRET = process.env.SESSION_SIGNING_SECRET;
const ENC_SECRET = process.env.SESSION_ENC_SECRET;

if (!SIGNING_SECRET || !ENC_SECRET) {
  throw new Error("SESSION_SIGNING_SECRET and SESSION_ENC_SECRET must be set");
}

const signKey = new TextEncoder().encode(SIGNING_SECRET);

async function getEncryptionKey(): Promise<Uint8Array> {
  return new Uint8Array(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ENC_SECRET)),
  );
}

export async function createSessionToken(
  sessionData: SessionData,
): Promise<string> {
  const encKey = await getEncryptionKey();

  const signed = await new SignJWT(sessionData)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .sign(signKey);

  const token = await new EncryptJWT({ jwt: signed })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM", typ: "JWE" })
    .setIssuedAt()
    .encrypt(encKey);

  return token;
}

export async function parseSessionToken(token?: string | null) {
  if (!token || typeof token !== "string") return null;
  try {
    const encKey = await getEncryptionKey();

    const { payload } = await jwtDecrypt(token, encKey, {
      clockTolerance: 10,
    });

    if (!(payload as { jwt: string }).jwt) {
      throw new Error("Invalid token structure");
    }

    const { payload: verifyPayload } = await jwtVerify(
      (payload as { jwt: string }).jwt,
      signKey,
      {
        clockTolerance: 10,
      },
    );

    return verifyPayload as SessionData;
  } catch (error) {
    console.warn(
      `Session token validation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    return null;
  }
}
