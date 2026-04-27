import { useState } from "react";
import Layout from "@/components/layout/Layout";
import TasksBoard from "@/components/Tasks/TasksTable";
import { useGetAllTasksQuery } from "@/rtk/Tasks/tasksApi";
import FolderSidebar from "@/components/Tasks/FolderSidebar";
import TasksTableView from "@/components/Tasks/TasksTableView";

const TasksPage = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const { data ,error } = useGetAllTasksQuery({
    type: "team",
  });

  const tasks = data?.data || [];


  return (
    <Layout>
      <div className="flex h-full">

        {/* LEFT SIDEBAR */}
        <FolderSidebar onSelectProject={setSelectedProject} />

        {/* RIGHT CONTENT */}
        <div className="flex-1 p-4 pt-6">
            <TasksTableView tasks={tasks} />
        </div>

      </div>
    </Layout>
  );
};

export default TasksPage;