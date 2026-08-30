  export type HierarchyRole = "viewer" | "member" | "manager" | "owner";

  export const ROLE_HIERARCHY: Record<HierarchyRole, number> = {
    viewer: 1,
    member: 2,
    manager: 3,
    owner: 4,
  };

  const isHierarchyRole = (role?: string | null): role is HierarchyRole =>
    Boolean(role && role in ROLE_HIERARCHY);

  export const getHighestRole = (
    ...roles: Array<string | null | undefined>
  ): HierarchyRole => {
    let highestRole: HierarchyRole = "viewer";

    for (const role of roles) {
      if (
        isHierarchyRole(role) &&
        ROLE_HIERARCHY[role] > ROLE_HIERARCHY[highestRole]
      ) {
        highestRole = role;
      }
    }

    return highestRole;
  };
  export const ROLE_PERMISSIONS: Record<HierarchyRole, string[]> = {
    viewer: ["read:workspace", "read:folder", "read:list", "read:task"],

    member: [
      "read:workspace",
      "read:folder",
      "read:list",
      "read:task",
      "create:task",
      "update:task",
    ],

    manager: [
      "read:workspace",
      "read:folder",
      "read:list",
      "read:task",

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

  export const hasPermission = (
    role: string | null | undefined,
    permission: string,
  ) => {
    const safeRole: HierarchyRole = isHierarchyRole(role) ? role : "viewer";

    const permissions = ROLE_PERMISSIONS[safeRole];

    return permissions.includes("*") || permissions.includes(permission);
  };

  export const isAdminRole = (role?: string | null) =>
    role === "owner" || role === "manager";

  /* =====================================
    EFFECTIVE ROLES
  ===================================== */

  export const resolveEffectiveFolderRole = ({
    workspaceRole,
    folderRole,
  }: {
    workspaceRole?: string | null;
    folderRole?: string | null;
  }) => getHighestRole(workspaceRole, folderRole);

  export const resolveEffectiveListRole = ({
    workspaceRole,
    folderRole,
    listRole,
  }: {
    workspaceRole?: string | null;
    folderRole?: string | null;
    listRole?: string | null;
  }) => getHighestRole(workspaceRole, folderRole, listRole);

  /* =====================================
    WORKSPACE ACTIONS
  ===================================== */

  export const canUpdateWorkspace = (workspaceRole?: string | null) =>
    hasPermission(workspaceRole, "update:workspace");

  export const canDeleteWorkspace = (workspaceRole?: string | null) =>
    hasPermission(workspaceRole, "delete:workspace");

  export const canManageWorkspaceMembers = (workspaceRole?: string | null) =>
    hasPermission(workspaceRole, "manage:members");

  export const canCreateFolder = (workspaceRole?: string | null) =>
    hasPermission(workspaceRole, "create:folder");

  export const canManageWorkspace = (workspaceRole?: string | null) =>
    canUpdateWorkspace(workspaceRole) ||
    canDeleteWorkspace(workspaceRole) ||
    canManageWorkspaceMembers(workspaceRole) ||
    canCreateFolder(workspaceRole);

  /* =====================================
    FOLDER ACTIONS
  ===================================== */

  export const canUpdateFolder = ({
    workspaceRole,
    folderRole,
  }: {
    workspaceRole?: string | null;
    folderRole?: string | null;
  }) => {
    const role = resolveEffectiveFolderRole({
      workspaceRole,
      folderRole,
    });

    return hasPermission(role, "update:folder");
  };

  export const canDeleteFolder = ({
    workspaceRole,
    folderRole,
  }: {
    workspaceRole?: string | null;
    folderRole?: string | null;
  }) => {
    const role = resolveEffectiveFolderRole({
      workspaceRole,
      folderRole,
    });

    return hasPermission(role, "delete:folder");
  };

  export const canManageFolderMembers = ({
    workspaceRole,
    folderRole,
  }: {
    workspaceRole?: string | null;
    folderRole?: string | null;
  }) => {
    const role = resolveEffectiveFolderRole({
      workspaceRole,
      folderRole,
    });

    return hasPermission(role, "manage:members");
  };

  export const canCreateList = ({
    workspaceRole,
    folderRole,
  }: {
    workspaceRole?: string | null;
    folderRole?: string | null;
  }) => {
    const role = resolveEffectiveFolderRole({
      workspaceRole,
      folderRole,
    });

    return hasPermission(role, "create:list");
  };

  export const canManageFolder = ({
    workspaceRole,
    folderRole,
  }: {
    workspaceRole?: string | null;
    folderRole?: string | null;
  }) =>
    canUpdateFolder({ workspaceRole, folderRole }) ||
    canDeleteFolder({ workspaceRole, folderRole }) ||
    canManageFolderMembers({ workspaceRole, folderRole }) ||
    canCreateList({ workspaceRole, folderRole });

  /* =====================================
    LIST ACTIONS
  ===================================== */

  type ListRoles = {
    workspaceRole?: string | null;
    folderRole?: string | null;
    listRole?: string | null;
  };

  export const canUpdateList = (roles: ListRoles) => {
    const role = resolveEffectiveListRole(roles);

    return hasPermission(role, "update:list");
  };

  export const canDeleteList = (roles: ListRoles) => {
    const role = resolveEffectiveListRole(roles);

    return hasPermission(role, "delete:list");
  };

  export const canManageListMembers = (roles: ListRoles) => {
    const role = resolveEffectiveListRole(roles);

    return hasPermission(role, "manage:members");
  };

  export const canManageList = (roles: ListRoles) =>
    canUpdateList(roles) || canDeleteList(roles) || canManageListMembers(roles);

  /* =====================================
    TASK ACTIONS
  ===================================== */

  export const canCreateTask = (roles: ListRoles) => {
    const role = resolveEffectiveListRole(roles);

    return hasPermission(role, "create:task");
  };



  export const canUpdateTask = (roles: ListRoles) => {
    const role = resolveEffectiveListRole(roles);

    return hasPermission(role, "update:task");
  };

  export const canDeleteTask = (roles: ListRoles) => {
    const role = resolveEffectiveListRole(roles);

    return hasPermission(role, "delete:task");
  };
