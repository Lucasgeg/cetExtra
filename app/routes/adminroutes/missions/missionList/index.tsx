/* eslint-disable react-hooks/rules-of-hooks */
import type { Statut } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { getUser } from "~/utils/auth.server";
import { deleteMission, getMissions } from "~/utils/missions.server";
import { format } from "date-fns";
import { useState } from "react";
import Menu from "~/components/Menu";
import MissionList from "~/components/MissionList";
import { getCurrentUser } from "~/utils/newAuth.server";

type Missions = {
  missionName: string;
  beginAt: Date;
  place: string;
  id: string;
};

type LoaderData = {
  userStatut: Statut;
  futureMissionList: Missions[];
  pastMissionList: Missions[];
  userId: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getCurrentUser(request);

  if (!user || user.statut == "USER") return redirect("/");
  const userId = user.id;
  const userStatut = user.statut;
  const futureMissionList = (await getMissions()).futureMisions;
  const pastMissionList = (await getMissions()).pastMissions;
  return json({
    futureMissionList: futureMissionList,
    pastMissionList: pastMissionList,
    userStatut: userStatut,
    userId,
  });
};
/* a faire: mission list / view information / update / delete 
    ⚠️ Localisation avec googlemap!!! ⚠️
*/
const index = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { futureMissionList, pastMissionList, userStatut, userId } =
    useLoaderData<LoaderData>();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [toPastMission, setToPastMission] = useState(false);
  const handleChange = () => {
    setToPastMission(!toPastMission);
  };
  const handleDelete = () => {
    const answer = prompt(
      "Merci de valider la suppression de la mission en écrivant : SUPPRIMER "
    );
    if (!answer || answer !== "SUPPRIMER")
      return alert("Erreur dans la saisie, pas de suppresion");
  };
  return (
    <div className="h-screen p-5">
      <Menu />
      <div className="w-full">
        <h1 className="text-center text-2xl my-2">cet Extra! Missions</h1>
        <MissionList />
      </div>
    </div>
  );
};

export default index;

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const selectedMissionId = form.get("missionId");

  if (!selectedMissionId || typeof selectedMissionId !== "string")
    return json({ error: "Id de mission non trouvé" });
  return await deleteMission(selectedMissionId);
};
