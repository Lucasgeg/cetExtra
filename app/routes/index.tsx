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
  const userId = await getUserId(request);
  if (!userId) return redirect("/sign-in");
  const isNew = await userIsNew(request);
  if (isNew) return redirect("/first-connexion");
  const user = await getCurrentUser(request);
  const userFutureMissions = (await userMissions(user.id)).futureMisions;

  const userStatut = user.statut;
  return json({ user, userStatut, userFutureMissions });
};

const index = () => {
  return (
    <>
      <div className="max-h-screen h-screen overflow-hidden w-full flex flex-col">
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
    <div className="h-1/2 w-5/6 m-auto p-10 text-center bg-slate-400 rounded-md">
      <div>
        <img src={logo} alt="logo cet Extra!" className="m-auto mb-5" />
        <h1 className="text-3xl"> cet Extra!</h1>
        <h2>Bienvenue {user.firstName} !</h2>
        <hr className="border-0 border-t border-black w-1/2 m-auto" />
        {userFutureMissions.length ? (
          <div className="mt-5">
            <p>
              Ta prochaine mission sera: <br />
              {userFutureMissions[0].missionName}
            </p>
            <p>et aura lieu: {userFutureMissions[0].place} </p>
            <p>
              le :
              {format(
                new Date(userFutureMissions[0].beginAt),
                "dd/MM/yyyy à hh:mm"
              )}
            </p>
            <p className="underline">
              <Link
                to={`adminroutes/missions/mission-information/${userFutureMissions[0].id}`}
              >
                Plus d'info
              </Link>
            </p>
          </div>
        ) : (
          <p className="mt-5">
            Pas encore de prochaine mission, mais ne t'en fait pas on ne
            t'oublie pas et on te contacte dès que nécessaire!
          </p>
        )}
      </div>
    </div>
  );
};
