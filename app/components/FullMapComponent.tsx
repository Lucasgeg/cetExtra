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
const center = { lat: 48.41010665893555, lng: -4.455512046813965 };
const zoom = 12;
const mapContainerStyle = { width: "100%", height: "50vh" };
const options = {
  styles: mapStyle,
  disableDefaultUI: true,
  zoomControl: true,
};
const FullMapComponent = () => {
  const { apiKey, futureMissionList } = useLoaderData<LoaderData>();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
  });
  const [selected, setSelected] = useState("");
  if (!isLoaded) return <div className="">Loading...</div>;
  return (
    <div className="">
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
  );
};

export default FullMapComponent;
