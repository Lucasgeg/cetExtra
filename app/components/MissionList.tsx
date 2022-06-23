import type { Missions, Statut } from "@prisma/client";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import { useState } from "react";

type LoaderData = {
  futureMissionList: Missions[];
  pastMissionList: Missions[];
  userStatut: Statut;
  userId: string;
  userFutureMissions: Missions[];
  userPastMissions: Missions[];
};

const MissionList = () => {
  const {
    futureMissionList,
    pastMissionList,
    userFutureMissions,
    userPastMissions,
    userStatut,
  } = useLoaderData<LoaderData>();

  const handleDelete = (e: React.FormEvent<HTMLFormElement>) => {
    const answer = prompt(
      "Merci de valider la suppression de la mission en écrivant : SUPPRIMER "
    );
    if (!answer || answer !== "SUPPRIMER") {
      e.preventDefault();
      return alert("Erreur dans la saisie, pas de suppresion");
    }
  };
  const [toPastMission, setToPastMission] = useState(false);
  return (
    <>
      <div className="flex w-1/4 justify-around p-5">
        <button
          onClick={() => setToPastMission(!toPastMission)}
          className="p-3 bg-slate-400 rounded-lg  hover:bg-orange-200"
        >
          {toPastMission ? "Prochaines missions" : "Missions passée"}
        </button>
        <button className="p-3 bg-slate-400 rounded-lg  hover:bg-orange-200">
          <Link to={"/adminroutes/missions/createMission"}>
            Créer une mission
          </Link>
        </button>
      </div>
      <table className="border-2 border-black mx-auto w-5/6 bg-slate-300 mt-2">
        <thead className="border-2 border-black">
          <tr>
            <th colSpan={4}>
              Liste des missions <br />
              {toPastMission ? "passées" : "à venir"}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-2 border-black">
            <th>Nom Mission</th>
            <th>Date Mission</th>
            <th>Lieu Mission</th>
            <th>Actions</th>
          </tr>
          {toPastMission ? (
            <>
              {}
              {(userStatut == "USER" ? userPastMissions : pastMissionList).map(
                (m) => (
                  <tr key={m.id} className="border-2 border-black">
                    <td>{m.missionName}</td>
                    <td>{format(new Date(m.beginAt), "dd/MM/yyyy HH:mm")}</td>
                    <td className="">{m.place}</td>
                    <td className="flex items-center justify-center">
                      <div className=" m-auto">
                        <Link
                          to={`/adminroutes/missions/mission-information/${m.id}`}
                        >
                          👁️
                        </Link>
                        {userStatut == "ADMIN" && (
                          <Form method="post" onSubmit={(e) => handleDelete(e)}>
                            <button
                              type="submit"
                              name={"missionId"}
                              value={m.id}
                            >
                              {" "}
                              ❌
                            </button>
                          </Form>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              )}
            </>
          ) : (userStatut == "USER" ? userFutureMissions : futureMissionList)
              .length ? (
            (userStatut == "USER" ? userFutureMissions : futureMissionList).map(
              (m) => {
                return (
                  <tr key={m.id}>
                    <td>{m.missionName}</td>
                    <td>{format(new Date(m.beginAt), "dd/MM/yyyy HH:mm")}</td>
                    <td className="w-48 text-center">
                      {m.place.split(",").map((mis) => mis + "")}
                    </td>
                    <td className="flex">
                      {
                        <Link
                          to={`/adminroutes/missions/mission-information/${m.id}`}
                        >
                          👁️
                        </Link>
                      }
                      {userStatut == "ADMIN" && (
                        <Form method="post" onSubmit={(e) => handleDelete(e)}>
                          <button type="submit" name={"missionId"} value={m.id}>
                            {" "}
                            ❌
                          </button>
                        </Form>
                      )}
                    </td>
                  </tr>
                );
              }
            )
          ) : (
            <>
              <tr>
                <td colSpan={4}>Pas de mission à venir!</td>
              </tr>
            </>
          )}
        </tbody>
        {userStatut !== "USER" && (
          <tfoot>
            <tr>
              <td colSpan={4} className="text-center">
                <button className="p-3 bg-slate-400 rounded-lg hover:bg-orange-200 my-1">
                  <Link to={"/adminroutes/missions/createMission"}>
                    Créer une mission
                  </Link>
                </button>
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </>
  );
};

export default MissionList;
