import Dashboard from "@/components/Dashboard";

// Sample data to test our components
const sampleUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/avatars/john.jpg",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "/avatars/jane.jpg",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice.brown@example.com",
    avatar: "/avatars/alice.jpg",
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie.wilson@example.com",
  },
];

const UserListItem = ({ user }: { user: (typeof sampleUsers)[number] }) => {
  return <li key={user.id}>{user.name}</li>;
};

const UsersList = () => {
  return (
    <ul>
      {sampleUsers.map((user, index) => (
        <UserListItem key={user.id} user={user} />
      ))}
    </ul>
  );
};

export default function Home() {
  return (
    <>
      <Dashboard users={sampleUsers} />
      <UsersList />
    </>
  );
}
