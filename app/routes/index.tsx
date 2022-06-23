import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, Links, useLoaderData } from "@remix-run/react";
import Menu from "~/components/Menu";
import { getCurrentUser, getUserId, userIsNew } from "~/utils/newAuth.server";
import logo from "~/assets/cetExtraIcon.png";
import type { Missions } from "@prisma/client";
import { userMissions } from "~/utils/users.server";
import Footer from "~/components/Footer";
import { format } from "date-fns";
type LoaderData = {
  user: {
    firstName: string;
    lastName: string;
  };
  userFutureMissions: Missions[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const clerkUserId = await getUserId(request);
  if (!clerkUserId) return redirect("/sign-in");
  const isNew = await userIsNew(request);
  if (isNew) return redirect("/first-connexion");
  const user = await getCurrentUser(request);
  const userFutureMissions = (await userMissions(user.id)).futureMisions;
  const userId = user.id;
  const userStatut = user.statut;
  return json({ user, userStatut, userFutureMissions, clerkUserId, userId });
};

const index = () => {
  return (
    <>
      <div className="max-h-screen h-screen w-full flex flex-col">
        <Menu />
        <Welcome />
        <Footer />
      </div>
    </>
  );
};

export default index;

const Welcome = () => {
  const { user, userFutureMissions } = useLoaderData<LoaderData>();

  return (
    <div className="h-fit w-1/2 mx-auto p-5 text-center bg-slate-400 rounded-md ">
      <div>
        <img
          src={logo}
          alt="logo cet Extra!"
          className="m-auto mb-5 max-h-20"
        />
        <h1 className="text-3xl"> cet Extra!</h1>
        <h2>Bienvenue {user.firstName} !</h2>
        <hr className="border-0 border-t border-black w-1/2 mx-auto my-5" />
        {userFutureMissions.length ? (
          <div className="">
            <p className="font-semibold my-2">Ta prochaine mission sera:</p>
            <span className="italic ">
              {" "}
              {userFutureMissions[0].missionName}{" "}
            </span>
            <p className="font-semibold my-2">Adresse: </p>{" "}
            <span className="italic "> {userFutureMissions[0].place}</span>
            <p className="font-semibold my-2">Date :</p>
            <span className="italic ">
              {" "}
              {format(
                new Date(userFutureMissions[0].beginAt),
                "dd/MM/yyyy à hh:mm"
              )}
            </span>
            <div className="my-5">
              <Link
                to={`adminroutes/missions/mission-information/${userFutureMissions[0].id}`}
              >
                <button
                  type="button"
                  className="inline-block px-6 py-2 border-2 border-gray-800 text-gray-800 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
                >
                  Plus d'info
                </button>
              </Link>
            </div>
            <hr className="border-0 border-t border-black w-1/2 mx-auto my-5" />
          </div>
        ) : (
          <p className="">
            Pas encore de prochaine mission, mais ne t'en fait pas on ne
            t'oublie pas et on te contacte dès que nécessaire!
          </p>
        )}
      </div>
    </div>
  );
};
