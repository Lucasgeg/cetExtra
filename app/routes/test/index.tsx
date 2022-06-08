import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import MapComponent from "~/components/MapComponent";

export const loader: LoaderFunction = async () => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  return json({ apiKey: apiKey });
};

const index = () => {
  return (
    <>
      <div className="">
        <MapComponent />
      </div>
    </>
  );
};

export default index;
