import { Missions } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Menu from "~/components/Menu";
import { getCurrentUser } from "~/utils/newAuth.server";
import {
  getMissionByToken,
  refuseMissionToken,
} from "~/utils/userMissions.server";

export const loader: LoaderFunction = async ({ params, request }) => {
  const token = params.token;

  const user = await getCurrentUser(request);
  if (!user) return redirect("/");

  const mission = await getMissionByToken(token);
  if (!mission) return redirect("/");

  try {
    const refuseMission = await refuseMissionToken(user.email, token);
    return json({ refuseMission });
  } catch (error) {
    return json({ error });
  }
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
  const { mission } = useLoaderData();

  return (
    <div className="">
      {mission.id ? (
        <>
          <h1>Pas disponible? Dommage!</h1>
          <p>Mais on se revoit une autre fois alors 😄</p>
          <Link to={"/"}>Retour à l'accueil</Link>
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
