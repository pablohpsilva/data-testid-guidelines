import React from "react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: "user-cards", label: "User Cards", icon: "👥" },
    { id: "products", label: "Products", icon: "🛍️" },
    { id: "todo", label: "Todo List", icon: "✅" },
    { id: "contact", label: "Contact Form", icon: "📧" },
  ];

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <span className="brand-icon">🧪</span>
        <span className="brand-text">Auto TestId Demo</span>
      </div>

      <ul className="nav-menu">
        {tabs.map((tab, index) => (
          <li key={tab.id} className="nav-item">
            <button
              className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => onTabChange(tab.id)}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span className="nav-label">{tab.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="nav-actions">
        <button className="btn btn-secondary">Help</button>
        <button className="btn btn-primary">View Source</button>
      </div>
    </nav>
  );
}
