import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useLoaderData } from "@remix-run/react";

const libraries = "places";

const center = { lat: 48.4099731, lng: -4.4552891 };
const mapContainerStyle = {
  width: "50vw",
  height: "50vh",
};
export default function GoogleMaps() {
  const { apiKey } = useLoaderData();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: [`${libraries}`],
  });
  if (!isLoaded) return <div className="">prout</div>;
  return (
    <div className="">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15}
      >
        <Marker position={{ lat: center.lat, lng: center.lng }} />
      </GoogleMap>
    </div>
  );
}
