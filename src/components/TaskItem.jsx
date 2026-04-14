export default function TaskItem({ task, tasks, depth, onDeleteTask }) {
  if (!task) return null;

  return (
    <li>
      <span>{"—".repeat(depth)} {task.title}</span>
      {task.parentId && (
        <span> [child of: {tasks[task.parentId]?.title}]</span>
      )}
      <button onClick={() => onDeleteTask(task.id)}>Delete</button>
      {task.childrenIds.length > 0 && (
        <ul>
          {task.childrenIds
            .filter((childId) => tasks[childId])
            .map((childId) => (
              <TaskItem
                key={childId}
                task={tasks[childId]}
                tasks={tasks}
                depth={depth + 1}
                onDeleteTask={onDeleteTask}
              />
            ))}
        </ul>
      )}
    </li>
  );
}
