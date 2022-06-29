import type { Missions, Statut } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import { useState } from "react";
import Menu from "~/components/Menu";
import MissionList from "~/components/MissionList";
import { getCurrentUser } from "~/utils/newAuth.server";
import { userMissions } from "~/utils/users.server";

type LoaderData = {
  userId: string;
  userFutureMissions: Missions[];
  userPastMissions: Missions[];
  userEmail: string;
  firstName: string;
  lastName: string;
  userStatut: Statut;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getCurrentUser(request);
  if (!user) return redirect("/");
  ///userInfos///
  const userId = user?.id;
  const userEmail = user?.email;
  const userPastMissions = (await userMissions(userId)).pastMissions;
  const userFutureMissions = (await userMissions(userId)).futureMisions;
  const firstName = user?.firstName;
  const lastName = user?.lastName;
  const userStatut = user.statut;
  const data: LoaderData = {
    userId,
    userFutureMissions,
    userPastMissions,
    userEmail,
    firstName,
    lastName,
    userStatut,
  };
  return json(data);
};

const index = () => {
  return (
    <div className="w-full">
      <Table />
    </div>
  );
};

export default index;

const Table = () => {
  const { userFutureMissions, userPastMissions } = useLoaderData<LoaderData>();
  const [toPastMission, setToPastMission] = useState(false);
  return (
    <div className="w-1/3 border border-black mx-auto p-2 h-fit">
      <h3 className="text-center underline font-semibold">
        {toPastMission ? "Missions passées" : "Missions prochaines"}
        <div className="">
          <ToggleButton
            toPastMission={toPastMission}
            setToPastMission={setToPastMission}
          />
        </div>
      </h3>
      <ul>
        {(toPastMission ? userPastMissions : userFutureMissions).map(
          (mission) => (
            <>
              <li key={mission.id} className="">
                <div className="flex justify-around">
                  <span>
                    {
                      <Link to={`/mission-information/${mission.id}`}>
                        {mission.missionName}
                      </Link>
                    }
                  </span>
                  <span>
                    {format(new Date(mission.beginAt), "dd/MM à HH:mm")}
                  </span>
                </div>
              </li>
              <hr className="w-1/2 mx-auto my-1" />
            </>
          )
        )}
      </ul>
    </div>
  );
};

const ToggleButton = ({ toPastMission, setToPastMission }) => {
  return (
    <div className="flex items-center justify-center w-full my-6">
      <label htmlFor="toggleB" className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            id="toggleB"
            className="sr-only"
            onClick={() => setToPastMission(!toPastMission)}
          />
          <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
          <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
        </div>
      </label>
    </div>
  );
};
