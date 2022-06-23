import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import Footer from "~/components/Footer";
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
    <div className="max-h-screen">
      <Menu />
      <h1 className="text-3xl text-center my-4">Liste des utilisateurs</h1>

      <div className="rightPart w-full py-3 mx-auto bg-orange-200 overflow-auto">
        <UserList />
      </div>

      <Footer />
    </div>
  );
};

export default usersList;
