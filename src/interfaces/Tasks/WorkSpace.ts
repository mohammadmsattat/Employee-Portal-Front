export type WorkspaceRole = "viewer" | "member" | "manager";

export interface WorkspaceMemberInput {
  user: string;
  role: WorkspaceRole;
}

export interface CreateWorkspaceInput {
  name: string;
  members: WorkspaceMemberInput[];
}

export interface StaffUser {
  _id: string;
  name?: string;
  email?: string;
}