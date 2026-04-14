import TaskItem from "./TaskItem";

export default function TaskList({ tasks, rootIds, onDeleteTask }) {
  if (rootIds.length === 0) {
    return <p>No tasks yet.</p>;
  }

  return (
    <ul>
      {rootIds
        .filter((id) => tasks[id])
        .map((id) => (
          <TaskItem key={id} task={tasks[id]} tasks={tasks} depth={0} onDeleteTask={onDeleteTask} />
        ))}
    </ul>
  );
}
