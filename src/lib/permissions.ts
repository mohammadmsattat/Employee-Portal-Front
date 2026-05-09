const ROLE_PERMISSIONS: Record<string, string[]> = {
  viewer: ["read:workspace", "read:list", "read:task"],

  member: [
    "read:workspace",
    "read:list",
    "read:task",
    "create:task",
    "update:task",
  ],

  manager: [
    "read:workspace",
    "update:workspace",
    "create:folder",
    "update:folder",
    "delete:folder",
    "create:list",
    "update:list",
    "delete:list",
    "create:task",
    "update:task",
    "delete:task",
    "manage:members",
  ],

  owner: ["*"],
};

export const hasPermission = (role: string, permission: string) => {
  const permissions = ROLE_PERMISSIONS[role] || [];
  if (permissions.includes("*")) return true;
  return permissions.includes(permission);
};