import { useLoaderData } from "@remix-run/react";
import React from "react";
import UserCard from "./UserCard";

const UserList = () => {
  const { userList } = useLoaderData();
  return (
    <ul className="grid grid-cols-3 gap-2">
      {userList.map((u) => (
        <li key={u.email}>
          <UserCard {...u} />
        </li>
      ))}
    </ul>
  );
};

export default UserList;
