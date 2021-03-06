import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useSubmit } from "@remix-run/react";
import TablePendingUserMission from "~/components/TablePendingUserMission";
import {
  deletePendingInvitation,
  pendingUserToMissionList,
} from "~/utils/userMissions.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const deleteNotification = form.getAll("selectedNotification");
  return deleteNotification.map(async (token) => {
    if (typeof token !== "string") throw new Error("Token is not a string");
    await deletePendingInvitation(token);
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const pendingUserToMission = await pendingUserToMissionList();

  return json({ pendingUserToMission });
};

const index = () => {
  return (
    <div>
      <TablePendingUserMission />
    </div>
  );
};

export default index;
