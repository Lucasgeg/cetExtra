import type { Missions, Statut } from "@prisma/client";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import { useState } from "react";
import FullMapComponent from "./FullMapComponent";

type LoaderData = {
  futureMissionList: Missions[];
  pastMissionList: Missions[];
  userStatut: Statut;
  userId: string;
  userFutureMissions: Missions[];
  userPastMissions: Missions[];
  apiKey: string;
};

//TODO liste des missions name dans partie map avec onClick(()=>panTo mission)

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
  const [page, setPage] = useState("missionList");
  const [toPastMission, setToPastMission] = useState(false);
  return (
    <>
      <div className="ml-5">
        {page == "missionList" ? (
          <button
            onClick={() => setToPastMission(!toPastMission)}
            type="button"
            className="mr-3 inline-block px-6 py-3 font-bold text-center bg-gradient-to-tl from-[#ffa600] to-[#c94000] uppercase align-middle transition-all rounded-lg cursor-pointer leading-[1.4] text-[0.75rem] ease-in tracking-tight shadow-md bg-150 bg-x-25 hover:scale-[1.02] active:opacity-[.85] hover:shadow-xs text-white"
          >
            {toPastMission ? "Prochaines missions" : "Missions passée"}
          </button>
        ) : (
          <button
            onClick={() => setPage("missionList")}
            type="button"
            className="mr-3 inline-block px-6 py-3 font-bold text-center bg-gradient-to-tl from-[#ffa600] to-[#c94000] uppercase align-middle transition-all rounded-lg cursor-pointer leading-[1.4] text-[0.75rem] ease-in tracking-tight shadow-md bg-150 bg-x-25 hover:scale-[1.02] active:opacity-[.85] hover:shadow-xs text-white"
          >
            Mission
          </button>
        )}
        <Link to={"/adminroutes/missions/createMission"}>
          <button
            type="button"
            className="mr-3 inline-block px-6 py-3 font-bold text-center bg-gradient-to-tl from-[#ffa600] to-[#c94000] uppercase align-middle transition-all rounded-lg cursor-pointer leading-[1.4] text-[0.75rem] ease-in tracking-tight shadow-md bg-150 bg-x-25 hover:scale-[1.02] active:opacity-[.85] hover:shadow-xs text-white"
          >
            Créer Mission
          </button>
        </Link>
        <button
          type="button"
          className="mr-3 inline-block px-6 py-3 font-bold text-center bg-gradient-to-tl from-[#ffa600] to-[#c94000] uppercase align-middle transition-all rounded-lg cursor-pointer leading-[1.4] text-[0.75rem] ease-in tracking-tight shadow-md bg-150 bg-x-25 hover:scale-[1.02] active:opacity-[.85] hover:shadow-xs text-white"
          onClick={() => setPage("map")}
        >
          Carte
        </button>
      </div>
      {page == "missionList" && (
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
                {(userStatut == "USER"
                  ? userPastMissions
                  : pastMissionList
                ).map((m) => (
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
                ))}
              </>
            ) : (userStatut == "USER" ? userFutureMissions : futureMissionList)
                .length ? (
              (userStatut == "USER"
                ? userFutureMissions
                : futureMissionList
              ).map((m) => {
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
              })
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
      )}
      {page == "map" && (
        <div className="w-5/6 mx-auto p-2">
          <FullMapComponent />
        </div>
      )}
    </>
  );
};

export default MissionList;
