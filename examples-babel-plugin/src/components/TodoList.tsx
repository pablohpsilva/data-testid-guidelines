import React, { useState } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Learn React", completed: true, createdAt: new Date() },
    {
      id: 2,
      text: "Set up Babel plugin",
      completed: true,
      createdAt: new Date(),
    },
    {
      id: 3,
      text: "Write comprehensive tests",
      completed: false,
      createdAt: new Date(),
    },
  ]);
  const [newTodoText, setNewTodoText] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: newTodoText.trim(),
        completed: false,
        createdAt: new Date(),
      };
      setTodos([...todos, newTodo]);
      setNewTodoText("");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="todo-list">
      <header className="todo-header">
        <h3>My Todo List</h3>
        <div className="todo-stats">
          <span className="stat">Total: {todos.length}</span>
          <span className="stat">Active: {activeCount}</span>
          <span className="stat">Completed: {completedCount}</span>
        </div>
      </header>

      <form className="todo-form" onSubmit={addTodo}>
        <div className="form-group">
          <label htmlFor="new-todo">Add new todo:</label>
          <div className="input-group">
            <input
              id="new-todo"
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="What needs to be done?"
            />
            <button type="submit" className="btn btn-primary">
              Add Todo
            </button>
          </div>
        </div>
      </form>

      <div className="todo-filters">
        <span>Show: </span>
        <button
          className={`btn ${
            filter === "all" ? "btn-primary" : "btn-secondary"
          }`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`btn ${
            filter === "active" ? "btn-primary" : "btn-secondary"
          }`}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={`btn ${
            filter === "completed" ? "btn-primary" : "btn-secondary"
          }`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      <div className="todos">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <p>No todos to show!</p>
          </div>
        ) : (
          <ul className="todo-items">
            {filteredTodos.map((todo, index) => (
              <li
                key={todo.id}
                className={`todo-item ${todo.completed ? "completed" : ""}`}
              >
                <div className="todo-content">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />
                  <span className="todo-text">{todo.text}</span>
                  <small className="todo-date">
                    {todo.createdAt.toLocaleDateString()}
                  </small>
                </div>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {completedCount > 0 && (
        <footer className="todo-footer">
          <button className="btn btn-secondary" onClick={clearCompleted}>
            Clear Completed ({completedCount})
          </button>
        </footer>
      )}
    </div>
  );
}
