/**
 * Role-based permission system using TypeScript mapped types
 * Demonstrates advanced TypeScript type manipulation and type safety
 */

const rolePermissions = {
  admin: ['create', 'edit', 'delete', 'view'],
  editor: ['edit', 'view'],
  viewer: ['view'],
} as const;

type RolePermissions = typeof rolePermissions;
type UserRoleType = keyof RolePermissions;
type ActionsForRole<R extends UserRoleType> = RolePermissions[R][number];

// Helper function to enforce narrowing
function getPermissionsForRole<R extends UserRoleType>(role: R): readonly ActionsForRole<R>[] {
  return rolePermissions[role];
}

function hasPermission<R extends UserRoleType>(role: R, action: ActionsForRole<R>): boolean {
  const permissionsForRole = getPermissionsForRole(role); // Narrowed correctly
  return permissionsForRole.includes(action);
}

// Usage examples
console.log(hasPermission('editor', 'edit')); // ✅ Correct, returns true
console.log(hasPermission('viewer', 'delete')); // ❌ Error: 'delete' is not valid for 'viewer'
console.log(hasPermission('admin', 'play')); // ❌ Error: 'play' is not valid for 'admin'
