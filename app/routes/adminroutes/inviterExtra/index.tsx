import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useEffect } from "react";
import CetExtraInvitation from "~/components/CetExtraInvitation";
import { getMissions } from "~/utils/missions.server";
import { getCurrentUser } from "~/utils/newAuth.server";
import {
  sendPendingUserToMission,
  userIsAllreadyOnTheMission,
  userIsOnTheMissionPendingList,
} from "~/utils/userMissions.server";
import { getUserList } from "~/utils/users.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const userMails = form.getAll("userMail");
  const missionId = form.get("missionId").toString();
  if (!userMails || !missionId || typeof missionId !== "string") {
    return json({ errors: "Merci de sélectionner un user et une mission" });
  }
  //verif si user es déjà dans la mission
  const errorName = [];
  await Promise.all(
    userMails.map(async (userMail) => {
      if (typeof userMail !== "string")
        return json({ alertMessage: "Erreur dans l'envois des invitations" });
      const userOnPendingList = await userIsOnTheMissionPendingList(
        userMail,
        missionId
      );
      if (userOnPendingList) return errorName.push(userOnPendingList);
      const userAllreadyOnMission = await userIsAllreadyOnTheMission(
        userMail,
        missionId
      );
      if (userAllreadyOnMission) return errorName.push(userAllreadyOnMission);

      return await sendPendingUserToMission(userMail, missionId);
    })
  );
  console.log(errorName);
  if (errorName.length > 0) return json({ errorName });
  return json({ userMails, showModal: true });
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await getCurrentUser(request);
  if (user.statut == "USER") return redirect("/");
  const userList = (await getUserList()).userList;
  const futureMissions = (await getMissions()).futureMisions;
  return { userList, futureMissions };
};
const index = () => {
  return (
    //TODO mapping user by workedTime et select role en partie gauche + possibilité d'en sélectionner plusieurs partie droite select mission avec carte (directement carte avec marker des future mission?)
    //diviser en deux la div, partie gauche listes des usercard (select par role) partie droite table des mission avec une en checkbox
    <div>
      <h1 className="text-center text-2xl underline mb-4">
        cet Extra! Invitation
      </h1>
      <CetExtraInvitation />
    </div>
  );
};

export default index;
