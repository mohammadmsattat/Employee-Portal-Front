export const ROLE_PERMISSIONS: Record<string, string[]> = {
  viewer: ["read"],

  member: [
    "read",
    "create:task",
    "update:task",
  ],

  manager: [
    "read",

    "update:workspace",
    "delete:workspace",
    "manage:workspace-members",

    "create:folder",
    "update:folder",
    "delete:folder",
    "manage:folder-members",

    "create:list",
    "update:list",
    "delete:list",
    "manage:list-members",

    "create:task",
    "update:task",
    "delete:task",
  ],

  owner: ["*"],
};

export const hasPermission = (
  role: string = "viewer",
  permission: string,
) => {
  const permissions = ROLE_PERMISSIONS[role] || [];

  if (permissions.includes("*")) {
    return true;
  }

  return permissions.includes(permission);
};

/* =========================
   HIERARCHY ACCESS
========================= */

export const resolveRoles = ({
  workspaceRole,
  folderRole,
  listRole,
}: {
  workspaceRole?: string;
  folderRole?: string;
  listRole?: string;
}) => {
  return {
    workspaceRole: workspaceRole || null,
    folderRole: folderRole || null,
    listRole: listRole || null,
  };
};

/* =========================
   WORKSPACE
========================= */

export const canManageWorkspace = (workspaceRole?: string) => {
  return (
    hasPermission(workspaceRole, "update:workspace") ||
    hasPermission(workspaceRole, "manage:workspace-members") ||
    hasPermission(workspaceRole, "delete:workspace")
  );
};

/* =========================
   FOLDER
========================= */

export const canManageFolder = ({
  workspaceRole,
  folderRole,
}: {
  workspaceRole?: string;
  folderRole?: string;
}) => {
  if (
    hasPermission(workspaceRole, "update:workspace") ||
    hasPermission(workspaceRole, "manage:workspace-members")
  ) {
    return true;
  }

  return (
    hasPermission(folderRole, "update:folder") ||
    hasPermission(folderRole, "manage:folder-members") ||
    hasPermission(folderRole, "delete:folder")
  );
};

/* =========================
   LIST
========================= */

export const canManageList = ({
  workspaceRole,
  folderRole,
  listRole,
}: {
  workspaceRole?: string;
  folderRole?: string;
  listRole?: string;
}) => {
  if (
    hasPermission(workspaceRole, "update:workspace") ||
    hasPermission(workspaceRole, "manage:workspace-members")
  ) {
    return true;
  }

  if (
    hasPermission(folderRole, "update:folder") ||
    hasPermission(folderRole, "manage:folder-members")
  ) {
    return true;
  }

  return (
    hasPermission(listRole, "update:list") ||
    hasPermission(listRole, "manage:list-members") ||
    hasPermission(listRole, "delete:list")
  );
};