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
import logo from "~/assets/cetExtraIcon.png";

export const loader: LoaderFunction = async ({ params, request }) => {
  const token = params.token;

  const user = await getCurrentUser(request);
  if (!user) return redirect("/");

  const mission = await getMissionByToken(token);

  await refuseMissionToken(user.email, token);
  console.log("toto lance le return");
  return mission;
};

const $token = () => {
  //TODO message de connexion sinon message d'erreur
  return (
    <div>
      <Message />
    </div>
  );
};

export default $token;

const Message = () => {
  const mission = useLoaderData();
  return (
    <div className="">
      {!mission ? (
        <div className="w-1/2 bg-orange-200 mx-auto mt-10 text-center p-4">
          <img src={logo} alt="logo cet extra" className="mx-auto mb-3" />
          <h1 className="text-3xl">cet Extra Dramatique! 😱😱</h1>
          <hr className="my-5 w-1/2 mx-auto border-black" />
          <p>Mission non trouvé !</p>
          <p>
            On a peut être eu un bug, ne t'en fait pas, tu n'es pas inscrit à la
            mission
          </p>
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
      ) : (
        <div className="w-1/2 bg-white mx-auto mt-10 text-center p-4">
          <img src={logo} alt="logo cet extra" className="mx-auto mb-3" />
          <h1>cet Extra Triste!</h1>
          <hr className="my-5 w-1/2 mx-auto border-black" />
          <p>Pas disponible? C'est pas grave on ne t'en veux pas 😉</p>
          <p>On se revoit une prochaine fois pour une autre mission alors!</p>
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
