import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hasAnyRole } from "@/lib/auth/roles";
import { JWT_COOKIE_NAME, verifyToken, type AppJwtPayload } from "@/lib/auth/jwt";

type RequireAuthOptions = {
  allowedRoles: string[];
  loginNextPath: string;
};

export async function requireAuth({
  allowedRoles,
  loginNextPath,
}: RequireAuthOptions): Promise<AppJwtPayload> {
  const token = (await cookies()).get(JWT_COOKIE_NAME)?.value;

  if (!token) {
    redirect(`/signin?next=${encodeURIComponent(loginNextPath)}`);
  }

  const payload = await verifyToken(token);
  if (!payload) {
    redirect(`/singin?next=${encodeURIComponent(loginNextPath)}`);
  }

  if (!hasAnyRole(payload.roles, allowedRoles)) {
    redirect("/403");
  }

  return payload;
}
