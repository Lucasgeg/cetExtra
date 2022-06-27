import { User } from "@prisma/client";
import { Form, useLoaderData } from "@remix-run/react";
import UserCard from "./UserCard";

const CetExtraInvitation = () => {
  return (
    <Form method="post" className="w-11/12 mx-auto bg-black flex">
      <div className="left w-5/6 bg-green-500">
        <Users />
      </div>
      <div className="right w-1/6 bg-white"></div>
    </Form>
  );
};

export default CetExtraInvitation;

const Users = () => {
  const userList: User[] = useLoaderData();

  return (
    <ul className="grid grid-cols-9 p-2">
      {userList.map((user) => (
        <li key={user.email} className="">
          <UserCard {...user} />
        </li>
      ))}
    </ul>
  );
};
