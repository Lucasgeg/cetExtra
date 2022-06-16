import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import React, { useState } from "react";
import { getUser } from "~/utils/auth.server";
import { getMissions } from "~/utils/missions.server";
import type { Missions } from "~/utils/prisma.server";
import {
  connectToMission,
  disconnectToMission,
  sendPendingUserToMission,
} from "~/utils/userMissions.server";
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

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await getUser(request);
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  user?.statut !== "ADMIN" ? redirect("/") : null;
  const missions = (await getMissions()).futureMisions;
  const userList = await getUserList();

  const data: LoaderData = {
    userList,
    missions,
  };

  return json(data);
};
const index = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { missions, userList } = useLoaderData<LoaderData>();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [formData, setFormData] = useState({
    user: "",
    mission: "",
  });
  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };
  return (
    <div>
      <h1>Formulaire de connection d'un utilisateur</h1>
      <Form method="post">
        <label htmlFor="user">Utilisateur</label>
        <br />
        <select
          name="user"
          id="user"
          value={formData.user}
          onChange={(e) => handleInputChange(e, "user")}
        >
          {userList.map((user) => (
            <option value={user.email} key={user.email}>
              {user.lastName} {user.firstName}
            </option>
          ))}
        </select>{" "}
        <br />
        <label htmlFor="mission">Mission</label>
        <br />
        <select
          name="mission"
          value={formData.mission}
          onChange={(e) => handleInputChange(e, "mission")}
        >
          {missions.map((mission) => (
            <option value={mission.id} key={mission.id}>
              {mission.missionName}
            </option>
          ))}
        </select>
        <br />
        <button type="submit" name="_action" value={"invite"}>
          proposer extra
        </button>
        <br />
        <button type="submit" name="_action" value={"connect"}>
          Connect
        </button>
        <br />
        <button type="submit" name="_action" value={"disconnect"}>
          Disconnect
        </button>
      </Form>
    </div>
  );
};

export default index;

export const action: ActionFunction = async ({ request }) => {
  //TODO recupérer les erreurs ou messages des fonctions
  const form = await request.formData();
  const action = form.get("_action");
  const user = form.get("user");
  const mission = form.get("mission");
  switch (action) {
    case "connect": {
      return await connectToMission(user, mission);
    }
    case "disconnect": {
      return await disconnectToMission(user, mission);
    }
    case "invite": {
      return await sendPendingUserToMission(user, mission);
    }
    default: {
      throw new Error("Error on the switch");
    }
  }
};
