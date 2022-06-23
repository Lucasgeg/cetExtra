import { useLoadScript } from "@react-google-maps/api";
import { Link, useLoaderData } from "@remix-run/react";
import { format } from "date-fns";

type Mission = {
  token: string;
  userMail: string;
  missionId: string;
  missionName: string;
  place: string;
  beginAt: Date;
};

type LoaderData = {
  pendingMissions: Mission[];
};

const Table = () => {
  const { pendingMissions } = useLoaderData<LoaderData>();
  console.log(pendingMissions);

  return (
    <div>
      <div className="relative flex flex-col w-full min-w-0 mb-0 break-words bg-white border-0 border-transparent border-solid shadow-soft-xl rounded-2xl bg-clip-border">
        <div className="p-6 pb-0 mb-0 bg-white rounded-t-2xl">
          <h6>Notifications</h6>
        </div>
        <div className="flex-auto px-0 pt-0 pb-2">
          <div className="p-0 overflow-x-auto">
            <table className="items-center w-full mb-0 align-top border-gray-200 text-slate-500">
              <thead className="align-bottom">
                <tr>
                  <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-size-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                    Notification
                  </th>
                  <th className="px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-size-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                    Date de la presta
                  </th>
                  <th className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-size-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {pendingMissions.map((mission) => (
                  <tr key={mission.missionId}>
                    <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                      <div className="flex px-2 py-1">
                        <div className="flex flex-col justify-center">
                          <h6 className="mb-0 leading-normal text-size-sm">
                            {mission.missionName}
                          </h6>
                          <p className="mb-0 leading-tight text-size-xs text-slate-400">
                            {mission.place}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                      <p className="mb-0 font-semibold leading-tight text-size-xs">
                        {format(new Date(mission.beginAt), "dd/mm/yy")}
                      </p>
                      <p className="mb-0 leading-tight text-size-xs text-slate-400">
                        {format(new Date(mission.beginAt), "hh:mm")}
                      </p>
                    </td>
                    <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                      <div className="flex justify-end">
                        <Link to={`/unvalid-mission/${mission.token}`}>
                          <button
                            type="button"
                            className="mr-3 inline-block px-6 py-3 font-bold text-center bg-gradient-to-tl from-[#ea0606] to-[#e11d48] uppercase align-middle transition-all rounded-lg cursor-pointer leading-[1.4] text-[0.75rem] ease-in tracking-tight shadow-md bg-150 bg-x-25 hover:scale-[1.02] active:opacity-[.85] hover:shadow-xs text-white"
                          >
                            Refuser
                          </button>
                        </Link>
                        <Link to={`/valid-mission/${mission.token}`}>
                          <button
                            type="button"
                            className="mr-3 inline-block px-6 py-3 font-bold text-center bg-gradient-to-tl from-[#2152ff] to-[#21d4fd] uppercase align-middle transition-all rounded-lg cursor-pointer leading-[1.4] text-[0.75rem] ease-in tracking-tight shadow-md bg-150 bg-x-25 hover:scale-[1.02] active:opacity-[.85] hover:shadow-xs text-white"
                          >
                            Accepter
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <button
        type="button"
        className=" mr-3 inline-block px-6 py-3 font-bold text-center bg-gradient-fuchsia uppercase align-middle transition-all rounded-lg cursor-pointer leading-pro text-size-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs text-white"
      >
        Button
      </button>
    </div>
  );
};

export default Table;
