import { SignedIn, SignOutButton, UserButton, useUser } from "@clerk/remix";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { getUser, userIsNew } from "~/utils/newAuth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUser(request);
  if (!userId) return redirect("/sign-in");
  const isNew = await userIsNew(userId);
  if (isNew) return redirect("/first-connexion");
  return json({ userId });
};

const index = () => {
  return (
    <div>
      <SignedIn>
        <UserButton />
        <SignOutButton />
      </SignedIn>
    </div>
  );
};

export default index;
