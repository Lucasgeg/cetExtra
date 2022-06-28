import { json, LoaderFunction, redirect } from "@remix-run/node";
import Menu from "~/components/Menu";
import Table from "~/components/TableMission";
import { getCurrentUser } from "~/utils/newAuth.server";
import {
  getMissionByToken,
  userPendingInvitation,
} from "~/utils/userMissions.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getCurrentUser(request);
  if (!user) return redirect("/");
  const userStatut = user.statut;
  const pendingMissions = await userPendingInvitation(user.email);

  return json({ user, userStatut, pendingMissions });
};

export default function index() {
  //useHook on components
  return (
    <div className="h-screen overflow-auto">
      <Menu />
      <h1>cet Extra - Notifications!</h1>
      {/* 
      TODO:
      Récup de la liste des invitations missions
      Accepter ou refuser avec prompt validation (voir modèle alert)
      */}
      <Table />
    </div>
  );
}
