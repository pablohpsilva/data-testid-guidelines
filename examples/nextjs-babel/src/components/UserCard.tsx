import { FC } from "react";

interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

// This component demonstrates:
// 1. Root DOM element getting component name
// 2. Child components getting hierarchical testIds
const UserCard: FC<UserCardProps> = ({ user }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <Avatar src={user.avatar} alt={user.name} />
      <UserInfo name={user.name} email={user.email} />
      <ActionButtons userId={user.id} />
    </div>
  );
};

// Component that demonstrates fragment usage
const Avatar: FC<{ src?: string; alt: string }> = ({ src, alt }) => {
  return (
    <>
      <ProfileImage src={src} alt={alt} />
      <StatusIndicator />
    </>
  );
};

const ProfileImage: FC<{ src?: string; alt: string }> = ({ src, alt }) => {
  return (
    <img
      className="w-16 h-16 rounded-full mx-auto mb-4"
      src={src || "/default-avatar.png"}
      alt={alt}
    />
  );
};

const StatusIndicator = () => {
  return (
    <div className="w-3 h-3 bg-green-500 rounded-full absolute top-2 right-2"></div>
  );
};

const UserInfo: FC<{ name: string; email: string }> = ({ name, email }) => {
  return (
    <div className="text-center">
      <UserName name={name} />
      <UserEmail email={email} />
    </div>
  );
};

const UserName: FC<{ name: string }> = ({ name }) => {
  return <h3 className="text-lg font-semibold text-gray-900">{name}</h3>;
};

const UserEmail: FC<{ email: string }> = ({ email }) => {
  return <p className="text-gray-600">{email}</p>;
};

const ActionButtons: FC<{ userId: string }> = ({ userId }) => {
  return (
    <div className="flex gap-2 mt-4">
      <EditButton userId={userId} />
      <DeleteButton userId={userId} />
    </div>
  );
};

const EditButton: FC<{ userId: string }> = ({ userId }) => {
  return (
    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
      Edit
    </button>
  );
};

const DeleteButton: FC<{ userId: string }> = ({ userId }) => {
  return (
    <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
      Delete
    </button>
  );
};

export default UserCard;
