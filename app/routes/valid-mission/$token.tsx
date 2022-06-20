import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import Menu from "~/components/Menu";
import { getCurrentUser } from "~/utils/newAuth.server";
import {
  getMissionByToken,
  validateMissionToken,
} from "~/utils/userMissions.server";

export const loader: LoaderFunction = async ({ params, request }) => {
  const token = params.token;
  const user = await getCurrentUser(request);
  const mission = await getMissionByToken(token);
  try {
    const validation = await validateMissionToken(user.email, token);
    return json({ validation, mission });
  } catch (error) {
    return json({ error });
  }
};

const $token = () => {
  //TODO message de connexion sinon message d'erreur
  return (
    <div>
      <Menu />
      <h1>toto</h1>
      <Message />
    </div>
  );
};

export default $token;

const Message = () => {
  const { validation, mission } = useLoaderData();

  return (
    <div className="">
      {mission.id ? (
        <>
          <h1>Vous êtes maintenant connecté a la mission:</h1>
          <p>{mission.missionName}</p>
          <p>le: {mission.beginAt}</p>
          <p>Lien de la mission</p>
        </>
      ) : (
        <p>Mission non trouvé, merci de contacter l'administrateur du site</p>
      )}
    </div>
  );
};
