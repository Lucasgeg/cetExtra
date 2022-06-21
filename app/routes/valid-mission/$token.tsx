import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import Menu from "~/components/Menu";
import { getCurrentUser } from "~/utils/newAuth.server";
import {
  getMissionByToken,
  validateMissionToken,
} from "~/utils/userMissions.server";
import Validate from "~/routes/valid-mission/validate";

type Mission = {
  id: string;
  missionName: string;
  place: string;
  beginAt: string;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const token = params.token;

  const user = await getCurrentUser(request);
  if (!user) return redirect("/");

  const mission = await getMissionByToken(token);
  await validateMissionToken(user.email, token);
  return mission;
};

const $token = () => {
  //TODO message de connexion sinon message d'erreur
  return (
    <div>
      <Menu />
      <Message />
    </div>
  );
};

export default $token;

const Message = () => {
  const mission: Mission = useLoaderData();

  return (
    <div className="">
      {mission.id ? (
        <>
          <h1>Vous êtes maintenant connecté a la mission:</h1>
          <p>{mission.missionName}</p>
          <p>le: {format(new Date(mission.beginAt), "dd/MM/yyyy HH:mm")}</p>
          <p>Lieu de rendez-vous: {mission.place}</p>
          <Link to={`/adminroutes/missions/${mission.id}`}>
            Page de la mission
          </Link>
        </>
      ) : (
        <div>
          <p>Mission non trouvé, merci de contacter l'administrateur du site</p>
          <Link to={"/"}>Retour à l'accueil</Link>
        </div>
      )}
    </div>
  );
};
