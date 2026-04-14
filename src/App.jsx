import useTaskManager from "./hooks/useTaskManager";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

export default function App() {
  const { tasks, rootIds, createTask, updateTask, deleteTask, undo, redo, goToIndex, canUndo, canRedo, currentIndex, historyLength } =
    useTaskManager();

  return (
    <div>
      <h1>Task Manager</h1>

      <div>
        <button disabled={!canUndo} onClick={undo}>Undo</button>
        <button disabled={!canRedo} onClick={redo}>Redo</button>
      </div>

      {historyLength > 1 && (
        <div>
          <label>History: {currentIndex} / {historyLength - 1}</label>
          <br />
          <input
            type="range"
            min={0}
            max={historyLength - 1}
            value={currentIndex}
            onChange={(e) => goToIndex(Number(e.target.value))}
          />
        </div>
      )}

      <h2>Add Task</h2>
      <TaskForm tasks={tasks} onCreateTask={createTask} />

      <h2>Tasks</h2>
      <TaskList tasks={tasks} rootIds={rootIds} onDeleteTask={deleteTask} />
    </div>
  );
}
