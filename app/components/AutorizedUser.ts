import { redirect } from "@remix-run/node";
import { getUser } from "~/utils/auth.server";

const AutorizedUser = async ({ request }: any) => {
  const user = await getUser(request);
  if (!user) return redirect("/login");
};

export default AutorizedUser;
