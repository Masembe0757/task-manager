# Task Manager

A minimal React app for hierarchical task management with full undo/redo and time-travel support.

## Features

- Create, update, and delete tasks
- Parent-child task relationships (nested hierarchy)
- Undo/redo with full history snapshots
- Time-travel slider to navigate to any point in history
- When a parent is deleted, children are promoted to root (not deleted)
- Circular reference prevention for parent-child relationships

## How It Works

Tasks are stored in a normalized dictionary (keyed by id). Each task has an `id`, `title`, `parentId`, and `childrenIds`. Every action (create, update, delete) pushes a complete snapshot of the task state onto a history array. Undo/redo and the slider simply move a pointer across these snapshots.

## Project Structure

```
src/
  hooks/
    useHistory.js         -- History engine: snapshots, undo, redo, time-travel
    useTaskManager.js     -- Task CRUD: create, update, delete, reparent
  components/
    TaskForm.jsx          -- Input form for creating tasks
    TaskList.jsx          -- Renders root-level tasks
    TaskItem.jsx          -- Single task with recursive children
  App.jsx                 -- Wires hooks and components together
  main.jsx                -- Entry point
```

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Tech

- React (functional components, hooks only)
- Vite
- No external state libraries
- No styling libraries
