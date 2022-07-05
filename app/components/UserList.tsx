import { Link, useLoaderData } from "@remix-run/react";
import UserCard from "./UserCard";

const UserList = () => {
  const { userList } = useLoaderData();
  return (
    <ul className="grid grid-cols-1 md:grid-cols-9 gap-2 auto-rows-auto">
      {/* TODO: choix par role/workedtime etc... */}
      {userList.map((u) => (
        <Link to={`/profil/${u.id}`} key={u.id}>
          <li key={u.email} className="px-2">
            <UserCard {...u} />
          </li>
        </Link>
      ))}
    </ul>
  );
};

export default UserList;
