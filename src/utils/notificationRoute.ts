export type NotificationEntity = {
  model: string;
  id?: string;
  workspaceId?: string;
  folderId?: string;
  listId?: string;
  taskId?: string;
  subTaskId?: string;
};

/**
 * @returns المسار أو null إذا لم يُعرف النوع
 */
export const getNotificationRoute = (
  entity: NotificationEntity | null | undefined,
): string | null => {
  if (!entity?.model || !entity?.id) return null;

  // =========================
  // HR MODELS
  // =========================
  if (entity.model === "LeaveRequest") {
    return `/leaves/Leaves?highlight=${entity.id}`;
  }

  if (entity.model === "OvertimeRequest") {
    return `/overtime/my-overtime-requests?highlight=${entity.id}`;
  }

  if (entity.model === "AdvanceRequest") {
    return `/advance/my-advance-requests?highlight=${entity.id}`;
  }

  // =========================
  // TASK MODELS
  // =========================
  const params = new URLSearchParams();

  if (entity.model === "Workspace") {
    params.set("type", "workspace");
    params.set("workspaceId", entity.id);
  } else if (entity.model === "Folder") {
    params.set("type", "folder");
    if (entity.workspaceId) params.set("workspaceId", entity.workspaceId);
    if (entity.folderId) params.set("folderId", entity.folderId);
  } else if (entity.model === "List") {
    params.set("type", "list");
    if (entity.workspaceId) params.set("workspaceId", entity.workspaceId);
    if (entity.folderId) params.set("folderId", entity.folderId);
    if (entity.listId) params.set("listId", entity.listId);
  } else if (entity.model === "Task") {
    params.set("type", "task");
    params.set("taskId", entity.taskId || entity.id);
    if (entity.listId) params.set("listId", entity.listId);
    if (entity.folderId) params.set("folderId", entity.folderId);
    if (entity.workspaceId) params.set("workspaceId", entity.workspaceId);
  } else if (entity.model === "SubTask") {
    params.set("type", "subtask");
    params.set("taskId", entity.taskId || entity.id);
    params.set("subTaskId", entity.subTaskId || entity.id);
    if (entity.listId) params.set("listId", entity.listId);
    if (entity.folderId) params.set("folderId", entity.folderId);
    if (entity.workspaceId) params.set("workspaceId", entity.workspaceId);
  } else {
    return null;
  }

  return `/tasks?${params.toString()}`;
};
