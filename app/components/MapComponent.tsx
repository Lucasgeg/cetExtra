import {
  GoogleMap,
  InfoWindow,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useCallback, useRef, useState } from "react";
import mapStyle from "./mapStyle";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover,
} from "@reach/combobox";
import { format } from "date-fns";
type Data = {
  formData: FormData;
  setFormData: any;
  search: boolean;
};
type FormData = {
  missionName: string;
  beginAt: string;
  endAt: string;
  place: string;
  lat: number;
  lng: number;
};
type libraries = [
  "drawing" | "geometry" | "localContext" | "places" | "visualization"
];

const center = { lat: 48.41010665893555, lng: -4.455512046813965 };
const zoom = 17;
const mapContainerStyle = { width: "full", height: "50vh" };
const library: libraries = ["places"];
const options = {
  styles: mapStyle,
  disableDefaultUI: true,
  zoomControl: true,
};
const MapComponent = ({ formData, setFormData, search }: Data) => {
  type LatLng = {
    lat: number;
    lng: number;
  };
  const { apiKey } = useLoaderData();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: library,
  });
  const [marker, setMarker] = useState<LatLng>({
    lat: null,
    lng: null,
  });
  const [selected, setSelected] = useState(false);
  const onMapClick = (e: google.maps.MapMouseEvent | undefined) => {
    if (typeof e == "undefined") return;

    setMarker({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });

    setFormData({
      ...formData,
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  };
  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);
  const actionData = useActionData();
  const panTo = useCallback(({ lat, lng }) => {
    if (!mapRef.current) return false;
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(15);
  }, []);
  if (!isLoaded) return <div className="">Loading...</div>;
  return (
    <div>
      {search ? (
        <Search panTo={panTo} formData={formData} setFormData={setFormData} />
      ) : null}
      {actionData?.errorPlace && <p>Entrer une adresse précise</p>}
      <GoogleMap
        center={
          formData.lat ? { lat: formData.lat, lng: formData.lng } : center
        }
        zoom={zoom}
        mapContainerStyle={mapContainerStyle}
        options={options}
        onLoad={onMapLoad}
        onClick={onMapClick}
      >
        {marker ? (
          <Marker
            position={
              formData.lat
                ? { lat: formData.lat, lng: formData.lng }
                : { lat: marker.lat, lng: marker.lng }
            }
            onClick={() => {
              setSelected(!selected);
            }}
          >
            {selected ? (
              <InfoWindow
                onCloseClick={() => {
                  setSelected(!selected);
                }}
              >
                <div className="text-center">
                  <h2>{formData.missionName}</h2>
                  <h3> {formData.place} </h3>

                  <p>
                    Heure de début:{" "}
                    {format(new Date(formData.beginAt), "dd/MM/yyyy HH:mm")}
                  </p>
                </div>
              </InfoWindow>
            ) : null}
          </Marker>
        ) : null}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;

export const Search = ({ formData, setFormData, panTo }) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();
    try {
      const results = await getGeocode({ address });
      const place = results[0].formatted_address;
      const { lat, lng } = getLatLng(results[0]);
      panTo({ lat, lng });
      setFormData({
        ...formData,
        place,
        lat: lat,
        lng: lng,
      });
    } catch (error) {
      console.log("Error!!! :", error);
    }
  };
  return (
    <div className="">
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Entrez une adresse"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ place_id, description }) => {
                return <ComboboxOption key={place_id} value={description} />;
              })}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
};
