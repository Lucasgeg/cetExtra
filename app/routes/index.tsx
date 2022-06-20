import {
  SignedIn,
  SignOutButton,
  useOrganizationList,
  UserButton,
  useUser,
} from "@clerk/remix";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import Menu from "~/components/Menu";
import { getCurrentUser, getUserId, userIsNew } from "~/utils/newAuth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (!userId) return redirect("/sign-in");
  const isNew = await userIsNew(request);
  if (isNew) return redirect("/first-connexion");
  const user = await getCurrentUser(request);
  const userStatut = user.statut;
  return json({ user, userStatut });
};

const index = () => {
  return (
    <div>
      <Toto />
      <Menu />
      <SignedIn>
        <UserButton />
        <SignOutButton />
      </SignedIn>
    </div>
  );
};

export default index;

const Toto = () => {
  return <></>;
};
