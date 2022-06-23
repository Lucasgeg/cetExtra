/* eslint-disable react-hooks/rules-of-hooks */

import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { deleteMission, getMissions } from "~/utils/missions.server";

import Menu from "~/components/Menu";
import MissionList from "~/components/MissionList";
import { getCurrentUser } from "~/utils/newAuth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getCurrentUser(request);

  if (!user || user.statut == "USER") return redirect("/");
  const userId = user.id;
  const userStatut = user.statut;
  const futureMissionList = (await getMissions()).futureMisions;
  const pastMissionList = (await getMissions()).pastMissions;
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  return json({
    futureMissionList: futureMissionList,
    pastMissionList: pastMissionList,
    userStatut: userStatut,
    userId,
    apiKey,
  });
};
const index = () => {
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
