import { Missions } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import format from "date-fns/format";

type Center = {
  center: { lat: number; lng: number };
  setCenter: any;
};
type LoaderData = {
  apiKey: string;
  futureMissionList: Missions[];
};
const FutureMissionsTable = ({ center, setCenter }: Center) => {
  const { futureMissionList } = useLoaderData<LoaderData>();
  return (
    <table className="items-center mb-0 align-top border-gray-200 text-slate-500 mx-auto max-h-[50vh]">
      <thead className="align-bottom">
        <tr>
          <th
            colSpan={2}
            className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-size-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70"
          >
            Missions
          </th>
        </tr>
      </thead>
      <tbody className="">
        {futureMissionList.map((mission, key) => (
          <tr key={key} className="text-center">
            <td
              className="cursor-pointer p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent"
              onClick={() => {
                setCenter({ lat: mission.lat, lng: mission.lng });
              }}
            >
              {mission.missionName}
            </td>
            <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
              {format(new Date(mission.beginAt), "dd/MM")}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FutureMissionsTable;
