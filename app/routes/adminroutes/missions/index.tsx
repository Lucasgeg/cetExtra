import { Statut } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Footer from "~/components/Footer";
import Menu from "~/components/Menu";
import { getUser } from "~/utils/auth.server";
import { getCurrentUser } from "~/utils/newAuth.server";

type LoaderData = {
  userStatut: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getCurrentUser(request);

  if (!user) return redirect("/");
  if (user.statut == "USER") return redirect("/");
  const userStatut = user.statut;
  return json({ userStatut });
};

const index = () => {
  return (
    <div className="h-screen overflow-auto">
      <Menu />
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
      <Footer />
    </div>
  );
};

export default index;
