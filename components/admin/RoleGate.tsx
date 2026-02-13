"use client";

import { Role } from "@prisma/client";
import { ReactNode } from "react";
import { useRole } from "./RoleContext";

interface RoleGateProps {
  /** Roles that are allowed to see the children */
  allowedRoles: Role[];
  children: ReactNode;
  /** Optional fallback content for unauthorized users */
  fallback?: ReactNode;
}

/**
 * Conditionally renders children based on the current user's role.
 * If the user's role is not in `allowedRoles`, renders `fallback` (default: null).
 *
 * Usage:
 * ```tsx
 * <RoleGate allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
 *   <button>Delete</button>
 * </RoleGate>
 * ```
 */
export function RoleGate({ allowedRoles, children, fallback = null }: RoleGateProps) {
  const { userRole } = useRole();

  if (!allowedRoles.includes(userRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
