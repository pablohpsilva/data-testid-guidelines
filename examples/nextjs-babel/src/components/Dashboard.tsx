import { FC } from "react";
import UserList from "./UserList";

interface DashboardProps {
  users: Array<{
    id: string;
    name: string;
    email: string;
    avatar?: string;
  }>;
}

// This component demonstrates:
// 1. Complex nested hierarchy
// 2. Multiple sections with different purposes
// 3. Mixed content (components + loops)
const Dashboard: FC<DashboardProps> = ({ users }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pt-16">
        <Sidebar>
          <SidebarMenu />
          <UserStats />
        </Sidebar>
        <MainContent>
          <WelcomeSection />
          <UserList users={users} />
          <RecentActivity />
        </MainContent>
      </main>
      <Footer />
    </div>
  );
};

// Navigation component with existing testId to test respectExisting
const Navigation = () => {
  return (
    <nav
      className="fixed top-0 left-0 right-0 bg-white shadow-md z-50"
      data-testid="custom-navigation"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Logo />
          <NavItems />
          <UserMenu />
        </div>
      </div>
    </nav>
  );
};

const Logo = () => {
  return (
    <div className="flex items-center">
      <LogoIcon />
      <LogoText />
    </div>
  );
};

const LogoIcon = () => {
  return <div className="w-8 h-8 bg-blue-600 rounded"></div>;
};

const LogoText = () => {
  return (
    <span className="ml-2 text-xl font-bold text-gray-900">Dashboard</span>
  );
};

const NavItems = () => {
  const items = ["Home", "Users", "Settings", "Reports"];

  return (
    <div className="hidden md:flex space-x-8">
      {items.map((item, index) => (
        <NavItem key={item} label={item} />
      ))}
    </div>
  );
};

const NavItem: FC<{ label: string }> = ({ label }) => {
  return (
    <a
      href="#"
      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
    >
      {label}
    </a>
  );
};

const UserMenu = () => {
  return (
    <div className="relative">
      <UserAvatar />
      <DropdownMenu />
    </div>
  );
};

const UserAvatar = () => {
  return <div className="w-8 h-8 bg-gray-300 rounded-full"></div>;
};

const DropdownMenu = () => {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden">
      <DropdownItem label="Profile" />
      <DropdownItem label="Logout" />
    </div>
  );
};

const DropdownItem: FC<{ label: string }> = ({ label }) => {
  return (
    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
      {label}
    </a>
  );
};

const Sidebar: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <aside className="fixed left-0 top-16 h-full w-64 bg-white shadow-md">
      <div className="p-6">{children}</div>
    </aside>
  );
};

const SidebarMenu = () => {
  const menuItems = ["Dashboard", "Users", "Analytics", "Settings"];

  return (
    <nav className="mb-8">
      <MenuTitle />
      <div className="space-y-2">
        {menuItems.map((item, index) => (
          <MenuItem key={item} label={item} />
        ))}
      </div>
    </nav>
  );
};

const MenuTitle = () => {
  return <h3 className="text-lg font-semibold text-gray-900 mb-4">Menu</h3>;
};

const MenuItem: FC<{ label: string }> = ({ label }) => {
  return (
    <a
      href="#"
      className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
    >
      {label}
    </a>
  );
};

const UserStats = () => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <StatsTitle />
      <StatsGrid />
    </div>
  );
};

const StatsTitle = () => {
  return <h4 className="font-medium text-gray-900 mb-3">Quick Stats</h4>;
};

const StatsGrid = () => {
  const stats = [
    { label: "Total Users", value: "1,234" },
    { label: "Active Today", value: "89" },
    { label: "New This Week", value: "12" },
  ];

  return (
    <div className="space-y-2">
      {stats.map((stat, index) => (
        <StatItem key={stat.label} label={stat.label} value={stat.value} />
      ))}
    </div>
  );
};

const StatItem: FC<{ label: string; value: string }> = ({ label, value }) => {
  return (
    <div className="flex justify-between">
      <StatLabel label={label} />
      <StatValue value={value} />
    </div>
  );
};

const StatLabel: FC<{ label: string }> = ({ label }) => {
  return <span className="text-sm text-gray-600">{label}</span>;
};

const StatValue: FC<{ value: string }> = ({ value }) => {
  return <span className="text-sm font-medium text-gray-900">{value}</span>;
};

const MainContent: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="ml-64 p-6">{children}</div>;
};

const WelcomeSection = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <WelcomeTitle />
      <WelcomeMessage />
      <QuickActions />
    </div>
  );
};

const WelcomeTitle = () => {
  return (
    <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h2>
  );
};

const WelcomeMessage = () => {
  return (
    <p className="text-gray-600 mb-4">
      Here's what's happening with your team today.
    </p>
  );
};

const QuickActions = () => {
  const actions = ["Add User", "Export Data", "Generate Report"];

  return (
    <div className="flex gap-3">
      {actions.map((action, index) => (
        <QuickAction key={action} label={action} />
      ))}
    </div>
  );
};

const QuickAction: FC<{ label: string }> = ({ label }) => {
  return (
    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
      {label}
    </button>
  );
};

const RecentActivity = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <ActivityTitle />
      <ActivityList />
    </div>
  );
};

const ActivityTitle = () => {
  return (
    <h3 className="text-lg font-semibold text-gray-900 mb-4">
      Recent Activity
    </h3>
  );
};

const ActivityList = () => {
  const activities = [
    "John Doe updated profile",
    "New user registered",
    "Data backup completed",
  ];

  return (
    <div className="space-y-3">
      {activities.map((activity, index) => (
        <ActivityItem key={activity} description={activity} />
      ))}
    </div>
  );
};

const ActivityItem: FC<{ description: string }> = ({ description }) => {
  return (
    <div className="flex items-center p-3 bg-gray-50 rounded">
      <ActivityIcon />
      <ActivityDescription description={description} />
    </div>
  );
};

const ActivityIcon = () => {
  return <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>;
};

const ActivityDescription: FC<{ description: string }> = ({ description }) => {
  return <span className="text-gray-700">{description}</span>;
};

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <FooterContent />
      </div>
    </footer>
  );
};

const FooterContent = () => {
  return (
    <div className="flex justify-between items-center">
      <Copyright />
      <FooterLinks />
    </div>
  );
};

const Copyright = () => {
  return (
    <p className="text-gray-600">
      &copy; 2024 Dashboard App. All rights reserved.
    </p>
  );
};

const FooterLinks = () => {
  const links = ["Privacy", "Terms", "Contact"];

  return (
    <div className="flex space-x-6">
      {links.map((link, index) => (
        <FooterLink key={link} label={link} />
      ))}
    </div>
  );
};

const FooterLink: FC<{ label: string }> = ({ label }) => {
  return (
    <a href="#" className="text-gray-600 hover:text-gray-900">
      {label}
    </a>
  );
};

export default Dashboard;
