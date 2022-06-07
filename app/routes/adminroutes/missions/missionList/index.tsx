/* eslint-disable react-hooks/rules-of-hooks */
import type { Statut } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUser } from "~/utils/auth.server";
import { getMissions } from "~/utils/missions.server";
import { format } from "date-fns";
import { useState } from "react";
import { Link } from "react-router-dom";

type Missions = {
  missionName: string;
  beginAt: Date;
  place: string;
  id: string;
};

type LoaderData = {
  userStatut: Statut;
  futureMissionList: Missions[];
  pastMissionList: Missions[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  if (!user || user.statut == "USER") return redirect("/");
  const userStatut = user.statut;
  const futureMissionList = (await getMissions()).futureMisions;
  const pastMissionList = (await getMissions()).pastMissions;
  return json({
    futureMissionList: futureMissionList,
    pastMissionList: pastMissionList,
    userStatut: userStatut,
  });
};
/* a faire: mission list / view information / update / delete 
    ⚠️ Localisation avec googlemap!!! ⚠️
*/
const index = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { futureMissionList, pastMissionList, userStatut } =
    useLoaderData<LoaderData>();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [toPastMission, setToPastMission] = useState(false);
  const handleChange = () => {
    setToPastMission(!toPastMission);
  };
  console.log(toPastMission);

  return (
    <div className="">
      <h1>Hello Mission List Page</h1>
      <button onClick={handleChange}>Voir les missions passée</button>
      <table>
        <thead>
          <tr>
            <th colSpan={4}>Liste des missions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Nom Mission</th>
            <th>Date Mission</th>
            <th>Lieu Mission</th>
            <th>Actions</th>
          </tr>
          {toPastMission ? (
            <>
              {pastMissionList.map((m) => (
                <tr key={m.id}>
                  <td>{m.missionName}</td>
                  <td>{format(new Date(m.beginAt), "dd/MM/yyyy HH:mm")}</td>
                  <td>{m.place}</td>
                  <td>
                    {" "}
                    <Link to={`/adminroutes/missions/missionUpdate/${m.id}`}>
                      👁️
                    </Link>
                    {userStatut == "USER" ? null : " ❌"}
                  </td>
                </tr>
              ))}
            </>
          ) : futureMissionList.length ? (
            <>
              <h2>Pas de mission à venir!</h2>
              <button>
                <Link to={"/adminroutes/missions/createMission"}>
                  Créer une mission
                </Link>
              </button>
            </>
          ) : (
            futureMissionList.map((m) => {
              <tr key={m.id}>
                <td>{m.missionName}</td>
                <td>{format(new Date(m.beginAt), "dd/MM/yyyy HH:mm")}</td>
                <td>{m.place}</td>
                <td>
                  {
                    <Link to={`/adminroutes/missions/missionUpdate/${m.id}`}>
                      👁️
                    </Link>
                  }
                  {userStatut !== "ADMIN" ? null : " ❌"}
                </td>
              </tr>;
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default index;
