/**
 * Resolves the destination URL based on the user's RBAC role.
 * Safe to use in both Client Components and Server Components.
 */
export function getRoleRedirectPath(role?: string | null): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "/super-admin/users";
    case "PROGRAM_ADMIN":
    case "ADMIN":
      return "/program-admin";
    case "INSTRUCTOR":
      return "/instructor";
    case "LEARNER":
    case "STUDENT":
    default:
      return "/dashboard";
  }
}

