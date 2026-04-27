// types/task.ts

export type TaskStatus = "todo" | "in_progress" | "review" | "done";

export interface TaskMember {
  _id: string;
  email: string;
  name?: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: string;

  startDate?: string;
  dueDate?: string;

  assignedTo: TaskMember[];

  comments?: { text: string; createdAt: string }[];
  attachments?: { url: string }[];
}