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

export function UserCard({ user }: UserCardProps) {
  const handleEdit = () => {
    alert(`Editing user: ${user.name}`);
  };

  const handleDelete = () => {
    if (confirm(`Delete user ${user.name}?`)) {
      alert(`User ${user.name} deleted`);
    }
  };

  return (
    <div className="card">
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <span style={{ fontSize: "2rem" }}>{user.avatar}</span>
        <div>
          <h3 style={{ margin: 0 }}>{user.name}</h3>
          <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
            {user.role}
          </p>
        </div>
      </header>

      <main>
        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: "0.25rem",
            }}
          >
            Email:
          </label>
          <span>{user.email}</span>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: "0.25rem",
            }}
          >
            Status:
          </label>
          <span
            style={{
              padding: "0.25rem 0.5rem",
              borderRadius: "4px",
              fontSize: "0.8rem",
              background: user.role === "Admin" ? "#e8f5e8" : "#f0f0f0",
              color: user.role === "Admin" ? "#2e7d32" : "#666",
            }}
          >
            {user.role === "Admin" ? "Active Admin" : "Regular User"}
          </span>
        </div>
      </main>

      <footer style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
        <button onClick={handleEdit} className="btn btn-primary">
          Edit User
        </button>
        <button onClick={handleDelete} className="btn btn-secondary">
          Delete
        </button>
        <button className="btn btn-secondary">View Profile</button>
      </footer>
    </div>
  );
}
