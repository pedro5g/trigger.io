import { getValidSession } from "@/lib/auth/server";

export async function GET() {
  const session = await getValidSession();

  if (!session) {
    return Response.json("Unauthorized", { status: 401 });
  }

  const cookieToken = session.accessToken + "_tm=" + session.expiresAt;

  return Response.json(
    { accessToken: session.accessToken, cookieToken },
    { status: 200 },
  );
}
