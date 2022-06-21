import { json, LoaderFunction, redirect } from "@remix-run/node";
import { getCurrentUser } from "~/utils/newAuth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getCurrentUser(request);
  if (!user) return redirect("/");
  return json(user);
};

export default function validate(mission, user) {
  //useHook on components
  console.log(mission);

  return (
    <div>
      <h1>Coucou validate Page</h1>
    </div>
  );
}
