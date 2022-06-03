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
  if (user.statut !== "ADMIN") return redirect("/");
  const userStatut = user.statut;
  return json({ userStatut });
};

const index = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { userStatut } = useLoaderData<LoaderData>();
  return (
    <div className="w-full h-screen max-h-screen overflow-hidden">
      <Menu statut={userStatut} />
      <h1>Hello Mission page!</h1>
      <div className="flex justify-around h-full  ">
        {userStatut == "ADMIN" ? (
          <Link
            to={"/adminroutes/missions/createMission"}
            className="createMission flex justify-center items-center m-auto w-1/4 h-16 bg-orange-200 rounded-lg cursor-pointer"
          >
            Créer Mission
          </Link>
        ) : null}
        <Link
          to={"/adminroutes/missions/missionList"}
          className="seeMission flex justify-center items-center m-auto w-1/4 h-16 bg-orange-200 rounded-lg cursor-pointer"
        >
          Consulter
        </Link>
      </div>
    </div>
  );
};

export default index;
