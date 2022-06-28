import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useState } from "react";
import CetExtraInvitation from "~/components/CetExtraInvitation";
import { getMissions } from "~/utils/missions.server";
import { sendPendingUserToMission } from "~/utils/userMissions.server";
import { getUserList } from "~/utils/users.server";

export const loader: LoaderFunction = async ({ params, request }) => {
  const userList = (await getUserList()).userList;
  const pendingMissions = (await getMissions()).futureMisions;
  return { userList, pendingMissions };
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const userMail = form.get("userMail").toString();
  const missionId = form.get("missionId").toString();

  if (
    !userMail ||
    !missionId ||
    typeof userMail !== "string" ||
    typeof missionId !== "string"
  )
    throw new Error("Action Function Error");

  return await sendPendingUserToMission(userMail, missionId);
};

const index = () => {
  return (
    <div>
      <CetExtraInvitation />
    </div>
  );
};
export default index;
