import React from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface UserCardProps {
  user: User;
}

// Notice: No manual testId props or data-testid attributes!
// The Babel plugin will automatically transform this component
export function UserCard({ user }: UserCardProps) {
  const handleEdit = () => {
    alert(`Editing user: ${user.name}`);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      alert(`User ${user.name} deleted!`);
    }
  };

  return (
    <div className="user-card">
      <header className="user-header">
        <div className="avatar">
          <span>{user.avatar}</span>
        </div>
        <div className="user-info">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <span className="role-badge">{user.role}</span>
        </div>
      </header>

      <div className="user-actions">
        <button className="btn btn-primary" onClick={handleEdit}>
          Edit User
        </button>
        <button className="btn btn-danger" onClick={handleDelete}>
          Delete
        </button>
      </div>

      <footer className="user-stats">
        <div className="stat">
          <span className="stat-label">User ID:</span>
          <span className="stat-value">{user.id}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Status:</span>
          <span className="stat-value">Active</span>
        </div>
      </footer>
    </div>
  );
}
