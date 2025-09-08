interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: "users", label: "Users", icon: "👥" },
    { id: "products", label: "Products", icon: "🛍️" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <nav className="bg-white p-4 rounded-lg mb-8 shadow-sm">
      <div className="flex gap-4 items-center">
        <span className="font-bold text-xl">🧪 Demo</span>

        <ul className="flex list-none gap-2 margin-0 padding-0">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <Wrapper>
                <button
                  onClick={() => onTabChange(tab.id)}
                  className={`
                  flex items-center gap-2 px-4 py-2 rounded-md transition-colors
                  ${
                    activeTab === tab.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              </Wrapper>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
