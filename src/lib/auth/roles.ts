export type RoleObject = { authority: string };
export type RoleInput = RoleObject[] | string[] | null | undefined;

export function normalizeRoles(roles: RoleInput): string[] {
  if (!roles?.length) return [];
  if (typeof roles[0] === "string") return roles as string[];
  return (roles as RoleObject[]).map((role) => role.authority).filter(Boolean);
}

export function hasRole(roles: RoleInput, requiredRole: string): boolean {
  return normalizeRoles(roles).includes(requiredRole);
}

export function hasAnyRole(roles: RoleInput, requiredRoles: string[]): boolean {
  const currentRoles = new Set(normalizeRoles(roles));
  return requiredRoles.some((role) => currentRoles.has(role));
}
