import { Statut } from "@prisma/client";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { getUser } from "~/utils/auth.server";
import { getMissions } from "~/utils/missions.server";

type Missions = {
  missionName: string;
  missionDate: Date;
  missionPlace: string;
};

type LoaderData = {
  userStatut: Statut;
  missionList: Missions;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  if (!user || user.statut == "USER") return redirect("/");
  const userStatut = user.statut;
  const missionList = await getMissions();

  return json({ missions: missionList, statut: userStatut });
};
/* a faire: mission list / view information / update / delete */
const index = () => {
  return <div>hello Missionlist page!</div>;
};

export default index;
