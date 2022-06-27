import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import React, { useState } from "react";
import ExtraInvitForm from "~/components/ExtraInvitForm";
import Menu from "~/components/Menu";
import { getUser } from "~/utils/auth.server";
import { getMissions } from "~/utils/missions.server";
import type { Missions } from "~/utils/prisma.server";
import { sendPendingUserToMission } from "~/utils/userMissions.server";
import { getUserList } from "~/utils/users.server";

type Users = {
  lastName: string;
  firstName: string;
  email: string;
};

type LoaderData = {
  userList: Users[];
  missions: Missions[];
};

export const action: ActionFunction = async ({ request }) => {
  //TODO recupérer les erreurs ou messages des fonctions
  const form = await request.formData();
  const action = form.get("_action");

  const userMail = form.get("userMail").toString();
  const missionId = form.get("missionId").toString();
  switch (action) {
    case "invite": {
      return await sendPendingUserToMission(userMail, missionId);
    }
    default: {
      throw new Error("Error on the switch");
    }
  }
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await getUser(request);
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  user?.statut !== "ADMIN" ? redirect("/") : null;
  const missions = (await getMissions()).futureMisions;
  const userList = (await getUserList()).userList;

  const data: LoaderData = {
    userList,
    missions,
  };

  return json(data);
};
const index = () => {
  return (
    //TODO mapping user by workedTime et select role en partie gauche + possibilité d'en sélectionner plusieurs partie droite select mission avec carte (directement carte avec marker des future mission?)
    //diviser en deux la div, partie gauche listes des usercard (select par role) partie droite table des mission avec une en checkbox
    <div>
      <Menu />
      <h1>Formulaire de connection d'un utilisateur</h1>
      <ExtraInvitForm />
    </div>
  );
};

export default index;
