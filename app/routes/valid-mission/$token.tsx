import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import Menu from "~/components/Menu";
import { getCurrentUser } from "~/utils/newAuth.server";
import {
  getMissionByToken,
  validateMissionToken,
} from "~/utils/userMissions.server";
import logo from "~/assets/cetExtraIcon.png";

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
  //verif user have token

  const mission = await getMissionByToken(token);
  await validateMissionToken(user.email, token);
  return mission;
};

const $token = () => {
  //TODO message de connexion sinon message d'erreur
  return (
    <div className="h-screen max-h-screen">
      <Menu />
      <Message />
    </div>
  );
};

export default $token;

const Message = () => {
  const mission: Mission = useLoaderData();

  return (
    <div>
      {mission.id ? (
        <div className="w-1/2 bg-white mx-auto mt-10 text-center p-4">
          <img src={logo} alt="logo cet extra" className="mx-auto mb-3" />
          <h1>cet Extra Ordinaire!</h1>
          <hr className="my-5 w-1/2 mx-auto border-black" />
          <p>Merci de ta validation, un petit récapitulatif de la mission:</p>
          <p className="font-semibold">Nom de la mission:</p>
          <p className="underline italic">{mission.missionName}</p>
          <p className="font-semibold">Date de la mission:</p>
          <p className="underline italic">
            {format(new Date(mission.beginAt), "dd/MM/yyyy HH:mm")}
          </p>
          <p className="font-semibold">Lieu de rendez-vous:</p>
          <p className="underline italic"> {mission.place}</p>
          <Link to={`/adminroutes/missions/mission-information/${mission.id}`}>
            <button
              type="button"
              className="inline-block px-6 py-2 border-2 border-gray-800 text-gray-800 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
            >
              Page de la mission
            </button>
          </Link>
        </div>
      ) : (
        <div className="w-1/2 bg-orange-200 mx-auto mt-10 text-center p-4">
          <img src={logo} alt="logo cet extra" className="mx-auto mb-3" />
          <h1 className="text-3xl">cet Extra Dramatique! 😱😱</h1>
          <hr className="my-5 w-1/2 mx-auto border-black" />
          <p>Mission non trouvé, </p>
          <p>As-tu vérifié dans tes missions si tu n'avais pas déjà validé?</p>
          <p>
            Sinon si le problème persiste merci de contacter l'administrateur du
            site
          </p>
          <Link to={"/"}>
            <button
              type="button"
              className="inline-block px-6 py-2 border-2 border-gray-800 text-gray-800 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
            >
              Retour à l'accueil
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};
