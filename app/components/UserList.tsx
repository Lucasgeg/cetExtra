import { Link, useLoaderData } from "@remix-run/react";
import React from "react";
import UserCard from "./UserCard";

const UserList = () => {
  const { userList } = useLoaderData();
  return (
    <ul className="grid grid-cols-3 gap-2">
      {/* TODO: choix par role/workedtime etc... */}
      {userList.map((u) => (
        <Link to={`/userUpdate/${u.id}`} key={u.id}>
          <li key={u.email} className="px-2">
            <UserCard {...u} />
          </li>
        </Link>
      ))}
    </ul>
  );
};

export default UserList;
