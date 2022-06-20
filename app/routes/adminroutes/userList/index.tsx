import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import Menu from "~/components/Menu";
import UserList from "~/components/UserList";
import { getCurrentUser } from "~/utils/newAuth.server";
import { deleteUser, getUserList } from "~/utils/users.server";

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
  const user = await getCurrentUser(request);
  const userStatut = user.statut;
  if (userStatut == "USER") return redirect("/");

  const userList = await getUserList();

  return json({ userList, userStatut });
};

const usersList = () => {
  return (
    <>
      <Menu />
      <div className="min-h-screen">
        <h1 className="text-3xl text-center">Hello UserList</h1>
        <div className="main w-full flex ">
          <div className="rightPart w-2/3 p-5 border-2 mx-auto">
            <UserList />
          </div>
        </div>
      </div>
    </>
  );
};

export default usersList;
