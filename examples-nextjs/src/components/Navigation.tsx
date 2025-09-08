interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: "users", label: "Users", icon: "👥" },
    { id: "products", label: "Products", icon: "🛍️" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <nav
      style={{
        background: "#fff",
        padding: "1rem",
        borderRadius: "8px",
        marginBottom: "2rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>🧪 Demo</span>

        <ul
          style={{
            display: "flex",
            listStyle: "none",
            gap: "0.5rem",
            margin: 0,
            padding: 0,
          }}
        >
          {tabs.map((tab, index) => (
            <li key={tab.id}>
              <button
                className={`btn ${
                  activeTab === tab.id ? "btn-primary" : "btn-secondary"
                }`}
                onClick={() => onTabChange(tab.id)}
              >
                <span>{tab.icon}</span>
                <span style={{ marginLeft: "0.5rem" }}>{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
