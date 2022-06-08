import {
  GoogleMap,
  InfoWindow,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import "@reach/combobox/styles.css";
import { useLoaderData } from "@remix-run/react";
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

type libraries = [
  "drawing" | "geometry" | "localContext" | "places" | "visualization"
];

const center = { lat: 48.41010665893555, lng: -4.455512046813965 };
const zoom = 17;
const mapContainerStyle = { width: "50vw", height: "50vh" };
const library: libraries = ["places"];
const options = {
  styles: mapStyle,
  disableDefaultUI: true,
  zoomControl: true,
};
const MapComponent = () => {
  type LatLng = {
    lat: any;
    lng: any;
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
    if (typeof e == "undefined") return false;
    setMarker({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  };
  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);
  const panTo = useCallback(({ lat, lng }) => {
    if (!mapRef.current) return false;
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(15);
  }, []);
  if (!isLoaded) return <div className="">Loading...</div>;
  return (
    <div>
      <Search panTo={panTo} />
      <GoogleMap
        center={center}
        zoom={zoom}
        mapContainerStyle={mapContainerStyle}
        options={options}
        onLoad={onMapLoad}
        onClick={onMapClick}
      >
        {marker ? (
          <Marker
            position={{ lat: marker.lat, lng: marker.lng }}
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
                <div className="">
                  <h2>Nom presta</h2>
                  <h3>Lieu Presta</h3>
                  <p>Adresse et heure</p>
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

const Search = ({ panTo }) => {
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
      const { lat, lng } = getLatLng(results[0]);
      panTo({ lat, lng });
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
