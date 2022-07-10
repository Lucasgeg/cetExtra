import { Link, useLoaderData } from "@remix-run/react";
import UserCard from "./UserCard";

const UserList = () => {
  const { userList } = useLoaderData();
  return (
    <ul className="grid grid-cols-1 md:grid-cols-9 gap-2 auto-rows-auto p-1">
      {/* TODO: choix par role/workedtime etc... */}
      {userList.map((u) => (
        <div
          className="h-44 pt-2 mx-auto max-w-[105px] hover:scale-105"
          key={u.id}
        >
          <Link to={`/profil/${u.id}`}>
            <li key={u.email} className="mx-auto">
              <UserCard {...u} />
            </li>
          </Link>
        </div>
      ))}
    </ul>
  );
};

export default UserList;
