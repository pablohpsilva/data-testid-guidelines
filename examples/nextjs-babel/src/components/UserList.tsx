import { FC } from "react";
import UserCard from "./UserCard";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface UserListProps {
  users: User[];
}

// This component demonstrates:
// 1. Loop handling with indexed testIds
// 2. Nested components in loops
const UserList: FC<UserListProps> = ({ users }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Header />
      <SearchBar />
      <div className="grid gap-4">
        {users.map((user, index) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
      <Pagination totalUsers={users.length} />
    </div>
  );
};

const Header = () => {
  return (
    <div className="mb-6">
      <Title />
      <Subtitle />
    </div>
  );
};

const Title = () => {
  return <h1 className="text-3xl font-bold text-gray-900">User Directory</h1>;
};

const Subtitle = () => {
  return <p className="text-gray-600 mt-2">Manage your team members</p>;
};

const SearchBar = () => {
  return (
    <div className="mb-6">
      <SearchInput />
      <FilterButton />
    </div>
  );
};

const SearchInput = () => {
  return (
    <input
      type="text"
      placeholder="Search users..."
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  );
};

const FilterButton = () => {
  return (
    <button className="mt-2 bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200">
      Filters
    </button>
  );
};

const Pagination: FC<{ totalUsers: number }> = ({ totalUsers }) => {
  return (
    <div className="mt-8 flex justify-center">
      <PreviousButton />
      <PageNumbers totalUsers={totalUsers} />
      <NextButton />
    </div>
  );
};

const PreviousButton = () => {
  return (
    <button className="px-3 py-2 text-gray-500 hover:text-gray-700">
      Previous
    </button>
  );
};

const PageNumbers: FC<{ totalUsers: number }> = ({ totalUsers }) => {
  const pages = Math.ceil(totalUsers / 10);

  return (
    <div className="flex gap-1">
      {Array.from({ length: pages }, (_, index) => (
        <PageNumber key={index} page={index + 1} />
      ))}
    </div>
  );
};

const PageNumber: FC<{ page: number }> = ({ page }) => {
  return (
    <button className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded">
      {page}
    </button>
  );
};

const NextButton = () => {
  return (
    <button className="px-3 py-2 text-gray-500 hover:text-gray-700">
      Next
    </button>
  );
};

export default UserList;
