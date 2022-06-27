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
import FutureMissionsTable from "./FutureMissionsTable";
type LoaderData = {
  apiKey: string;
  futureMissionList: Missions[];
};
type Center = {
  center: { lat: number; lng: number };
  setCenter: any;
};
let zoom = 12;
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
        <FutureMissionsTable center={center} setCenter={setCenter} />
      </div>
    </div>
  );
};

export default FullMapComponent;
