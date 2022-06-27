import type { Missions } from "@prisma/client";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import { useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import { useState } from "react";
import { Link } from "react-router-dom";
import mapStyle from "./mapStyle";
import logo from "~/assets/cetExtraIcon.png";
type LoaderData = {
  apiKey: string;
  futureMissionList: Missions[];
};
type Center = {
  center: { lat: number; lng: number };
  setCenter: any;
};
const zoom = 12;
const mapContainerStyle = { width: "100%", height: "100%" };
const options = {
  styles: mapStyle,
  disableDefaultUI: true,
  zoomControl: true,
};
const FullMapComponent = ({ center, setCenter }: Center) => {
  const { apiKey, futureMissionList } = useLoaderData<LoaderData>();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
  });
  const [selected, setSelected] = useState("");
  if (!isLoaded) return <div className="">Loading...</div>;
  return (
    <div className="flex h-auto">
      <div className="Map w-5/6 h-[60vh]">
        <GoogleMap
          zoom={zoom}
          center={center}
          mapContainerStyle={mapContainerStyle}
          options={options}
          onClick={() => setSelected("")}
        >
          {futureMissionList.map(
            (mission) =>
              mission.lat && (
                <Marker
                  position={{ lat: mission.lat, lng: mission.lng }}
                  onClick={() => setSelected(mission.id)}
                  icon={{
                    url: logo,
                    scaledSize: new window.google.maps.Size(33, 33),
                  }}
                  key={mission.id}
                >
                  {selected == `${mission.id}` ? (
                    <InfoWindow onCloseClick={() => setSelected("")}>
                      <div className="text-center">
                        <h2 className="uppercase">{mission.missionName}</h2>
                        <p>{format(new Date(mission.beginAt), "dd/MM/yy")}</p>
                        <p>{mission.place}</p>
                        <Link
                          to={`/adminroutes/missions/mission-information/${mission.id}`}
                        >
                          <p className="italic underline">Infos</p>
                        </Link>
                      </div>
                    </InfoWindow>
                  ) : null}
                </Marker>
              )
          )}
        </GoogleMap>
      </div>
      <div className="missionListTable w-1/6">
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
                  onClick={() =>
                    setCenter({ lat: mission.lat, lng: mission.lng })
                  }
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
      </div>
    </div>
  );
};

export default FullMapComponent;
