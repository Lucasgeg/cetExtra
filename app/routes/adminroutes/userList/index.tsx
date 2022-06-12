import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import UserCard from "~/components/UserCard";
import { getUser } from "~/utils/auth.server";
import { deleteUser, getUserList } from "~/utils/users.server";

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

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const selectedUserId = form.get("selectedUserId");
  const action = form.get("_action");

  switch (action) {
    case "delete": {
      if (!selectedUserId || typeof selectedUserId !== "string") {
        return json({ error: "User Id not found on the db" });
      }
      return await deleteUser(selectedUserId);
    }
    default:
      return json({ error: "error on the action Switch" });
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  user?.statut !== "ADMIN" ? redirect("/") : null;

  const userList = await getUserList();

  return json({ users: userList });
};

const usersList = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
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
