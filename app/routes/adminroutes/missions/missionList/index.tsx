/* eslint-disable react-hooks/rules-of-hooks */
import type { Statut } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { getUser } from "~/utils/auth.server";
import { deleteMission, getMissions } from "~/utils/missions.server";
import { format } from "date-fns";
import { useState } from "react";
import Menu from "~/components/Menu";

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
  const handleDelete = () => {
    const answer = prompt(
      "Merci de valider la suppression de la mission en écrivant : SUPPRIMER "
    );
    if (!answer || answer !== "SUPPRIMER")
      return alert("Erreur dans la saisie, pas de suppresion");
  };
  return (
    <div className="">
      <Menu statut={userStatut} />
      <h1>Hello Mission List Page</h1>
      <button onClick={handleChange}>Voir les missions passée</button>
      <table>
        <thead>
          <tr>
            <th colSpan={4}>
              Liste des missions <br />
              {toPastMission ? "passées" : "à venir"}
            </th>
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
                  <td>{format(new Date(m.beginAt), "MM/dd/yyyy HH:mm")}</td>
                  <td>{m.place}</td>
                  <td className="flex">
                    {" "}
                    <Link to={`/adminroutes/missions/missionUpdate/${m.id}`}>
                      👁️
                    </Link>
                    {userStatut == "USER" ? null : (
                      <Form method="post">
                        <button
                          type="submit"
                          onClick={handleDelete}
                          name={"missionId"}
                          value={m.id}
                        >
                          {" "}
                          ❌
                        </button>
                      </Form>
                    )}
                  </td>
                </tr>
              ))}
            </>
          ) : futureMissionList.length ? (
            futureMissionList.map((m) => {
              return (
                <tr key={m.id}>
                  <td>{m.missionName}</td>
                  <td>{format(new Date(m.beginAt), "dd/MM/yyyy HH:mm")}</td>
                  <td>{m.place}</td>
                  <td className="flex">
                    {
                      <Link to={`/adminroutes/missions/missionUpdate/${m.id}`}>
                        👁️
                      </Link>
                    }
                    <Form method="post">
                      <button
                        type="submit"
                        onClick={handleDelete}
                        name={"missionId"}
                        value={m.id}
                      >
                        {" "}
                        ❌
                      </button>
                    </Form>
                  </td>
                </tr>
              );
            })
          ) : (
            <>
              <tr>
                <td colSpan={4}>Pas de mission à venir!</td>
              </tr>
            </>
          )}
        </tbody>
      </table>
      <button>
        <Link to={"/adminroutes/missions/createMission"}>
          Créer une mission
        </Link>
      </button>
    </div>
  );
};

export default index;

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const selectedMissionId = form.get("missionId");

  if (!selectedMissionId || typeof selectedMissionId !== "string")
    return json({ error: "Id de mission non trouvé" });
  return await deleteMission(selectedMissionId);
};
