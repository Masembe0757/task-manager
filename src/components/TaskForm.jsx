import { useState, useEffect } from "react";

export default function TaskForm({ tasks, onCreateTask }) {
  const [title, setTitle] = useState("");
  const [parentId, setParentId] = useState("");

  // Reset parent selection if the selected task no longer exists
  useEffect(() => {
    if (parentId && !tasks[parentId]) {
      setParentId("");
    }
  }, [tasks, parentId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    onCreateTask(trimmed, parentId || null);
    setTitle("");
    setParentId("");
  };

  const allTasks = Object.values(tasks);

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select value={parentId} onChange={(e) => setParentId(e.target.value)}>
        <option value="">No parent (root)</option>
        {allTasks.map((t) => (
          <option key={t.id} value={t.id}>
            {t.title}
          </option>
        ))}
      </select>
      <button type="submit">Add Task</button>
    </form>
  );
}
