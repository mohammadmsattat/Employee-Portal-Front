const TasksSummary = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "done").length;
  const inProgress = tasks.filter(t => t.status === "in_progress").length;
  const overdue = tasks.filter(t => new Date(t.dueDate) < new Date()).length;

  const Card = ({ title, value }) => (
    <div className="rounded-[24px] border bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <Card title="Total" value={total} />
      <Card title="In Progress" value={inProgress} />
      <Card title="Completed" value={completed} />
      <Card title="Overdue" value={overdue} />
    </div>
  );
};

export default TasksSummary;