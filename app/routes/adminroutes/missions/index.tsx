import { Statut } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Menu from "~/components/Menu";
import { getUser } from "~/utils/auth.server";

type LoaderData = {
  userStatut: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (!user) return redirect("/login");
  if (user.statut == "USER") return redirect("/");
  const userStatut = user.statut;
  return json({ userStatut });
};

const index = () => {
  return (
    <div className="h-screen">
      <Menu />
      <h1>Hello Mission page!</h1>
      <div className="h-5/6 flex flex-col justify-around">
        <Link
          to={"/adminroutes/missions/createMission"}
          className="createMission flex justify-center items-center m-auto w-1/4 h-16 bg-orange-200 rounded-lg cursor-pointer"
        >
          Créer Mission
        </Link>

        <Link
          to={"/adminroutes/missions/missionList"}
          className="seeMission flex justify-center items-center m-auto w-1/4 h-16 bg-orange-200 rounded-lg cursor-pointer"
        >
          Consulter
        </Link>
        <Link
          to={"/adminroutes/inviterExtra"}
          className="seeMission flex justify-center items-center m-auto w-1/4 h-16 bg-orange-200 rounded-lg cursor-pointer"
        >
          Inviter cetExtra
        </Link>
      </div>
    </div>
  );
};

export default index;
