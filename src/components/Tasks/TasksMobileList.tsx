const TasksMobileList = ({ tasks }) => {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task._id} className="rounded-2xl border bg-white p-4">
          <h3 className="font-semibold">{task.title}</h3>
          <p className="text-sm text-slate-500">{task.status}</p>
          <p className="text-sm">Due: {task.dueDate}</p>
        </div>
      ))}
    </div>
  );
};

export default TasksMobileList;