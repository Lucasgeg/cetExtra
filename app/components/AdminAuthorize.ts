import { redirect } from "@remix-run/node";
import { getUser } from "~/utils/auth.server";

export const adminOnly = async (request) => {
  const user = await getUser(request);
  const userStatut = user.statut;
  if (userStatut == "ADMIN") return true;
  return redirect("/");
};
