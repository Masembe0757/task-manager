import { useCallback } from "react";
import useHistory from "./useHistory";

let idCounter = 1;

function isDescendant(tasks, ancestorId, targetId) {
  let nodeId = targetId;
  while (nodeId) {
    if (nodeId === ancestorId) return true;
    nodeId = tasks[nodeId]?.parentId;
  }
  return false;
}

function detachFromParent(tasks, rootIds, taskId) {
  const task = tasks[taskId];
  if (!task || task.parentId === null) return { tasks, rootIds };

  const parent = tasks[task.parentId];
  if (!parent) return { tasks, rootIds };

  return {
    tasks: {
      ...tasks,
      [taskId]: { ...task, parentId: null },
      [parent.id]: {
        ...parent,
        childrenIds: parent.childrenIds.filter((cid) => cid !== taskId),
      },
    },
    rootIds: [...rootIds, taskId],
  };
}

function attachToParent(tasks, rootIds, taskId, parentId) {
  const task = tasks[taskId];
  const parent = tasks[parentId];
  if (!task || !parent) return { tasks, rootIds };

  return {
    tasks: {
      ...tasks,
      [taskId]: { ...task, parentId },
      [parentId]: {
        ...parent,
        childrenIds: [...parent.childrenIds, taskId],
      },
    },
    rootIds: rootIds.filter((rid) => rid !== taskId),
  };
}

function removeTask(state, targetId) {
  const target = state.tasks[targetId];
  if (!target) return state;

  let { tasks, rootIds } = state;

  // Detach each child — they become root tasks
  for (const childId of target.childrenIds) {
    if (tasks[childId]) {
      ({ tasks, rootIds } = detachFromParent(tasks, rootIds, childId));
    }
  }

  // Detach the target from its own parent
  ({ tasks, rootIds } = detachFromParent(tasks, rootIds, targetId));

  // Remove the target from the dict and rootIds
  const { [targetId]: _removed, ...remainingTasks } = tasks;
  return {
    tasks: remainingTasks,
    rootIds: rootIds.filter((rid) => rid !== targetId),
  };
}

export default function useTaskManager() {
  const { current, applyChange, undo, redo, goToIndex, canUndo, canRedo, currentIndex, historyLength } =
    useHistory();

  const createTask = useCallback(
    (title, parentId = null) => {
      if (parentId && !current.tasks[parentId]) return;

      const id = String(idCounter++);
      const newTask = { id, title, parentId: null, childrenIds: [] };

      let tasks = { ...current.tasks, [id]: newTask };
      let rootIds = [...current.rootIds, id];

      if (parentId) {
        ({ tasks, rootIds } = attachToParent(tasks, rootIds, id, parentId));
      }

      applyChange({ tasks, rootIds });
    },
    [current, applyChange]
  );

  const updateTask = useCallback(
    (id, updates) => {
      const task = current.tasks[id];
      if (!task) return;

      const { childrenIds: _children, id: _id, parentId: newParentId, ...fieldUpdates } = updates;
      const parentChanged = "parentId" in updates && newParentId !== task.parentId;

      if (parentChanged) {
        if (newParentId && !current.tasks[newParentId]) return;
        if (newParentId && isDescendant(current.tasks, id, newParentId)) return;
      }

      let tasks = {
        ...current.tasks,
        [id]: { ...task, ...fieldUpdates, id, childrenIds: task.childrenIds },
      };
      let rootIds = [...current.rootIds];

      if (parentChanged) {
        if (task.parentId !== null) {
          ({ tasks, rootIds } = detachFromParent(tasks, rootIds, id));
        }
        if (newParentId) {
          ({ tasks, rootIds } = attachToParent(tasks, rootIds, id, newParentId));
        }
      }

      applyChange({ tasks, rootIds });
    },
    [current, applyChange]
  );

  const deleteTask = useCallback(
    (id) => {
      if (!current.tasks[id]) return;
      applyChange(removeTask({ tasks: current.tasks, rootIds: current.rootIds }, id));
    },
    [current, applyChange]
  );

  return {
    tasks: current.tasks,
    rootIds: current.rootIds,
    createTask,
    updateTask,
    deleteTask,
    undo,
    redo,
    goToIndex,
    canUndo,
    canRedo,
    currentIndex,
    historyLength,
  };
}
