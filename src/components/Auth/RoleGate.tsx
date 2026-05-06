"use client";

import { decodeTokenUnsafe } from "@/lib/auth/jwt";
import { hasAnyRole } from "@/lib/auth/roles";

type RoleGateProps = {
  token?: string;
  allow: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export default function RoleGate({
  token,
  allow,
  children,
  fallback = null,
}: RoleGateProps) {
  if (!token) return <>{fallback}</>;

  const payload = decodeTokenUnsafe(token);
  if (!payload) return <>{fallback}</>;

  return hasAnyRole(payload.roles, allow) ? <>{children}</> : <>{fallback}</>;
}
