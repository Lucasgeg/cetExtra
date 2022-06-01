import { json, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import UserCard from "~/components/UserCard";
import { getUser } from "~/utils/auth.server";
import { getUserList } from "~/utils/users.server";

type Users = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: number;
  statut: number;
  workedTime: number;
};
type LoaderData = {
  users: Users[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  user?.statut !== 1 ? redirect("/") : null;

  const userList = await getUserList();

  return json({ users: userList });
};

const usersList = () => {
  const { users } = useLoaderData<LoaderData>();

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl text-center">Hello UserList</h1>
      <div className="main w-full flex">
        <div className="rightPart w-2/3 p-5 border-2">
          <ul>
            {users.map((u) => (
              <li key={u.email}>
                <UserCard {...u} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default usersList;
