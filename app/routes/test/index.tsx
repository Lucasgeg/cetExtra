import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import MapComponent from "~/components/MapComponent";
import { getMissions } from "~/utils/missions.server";

type Mission = {
  place: string;
  beginAt: Date;
  endAt: Date;
  missionName: String;
};

type LoaderData = {
  missions: Mission[];
};

export const loader: LoaderFunction = async () => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const futureMissionList = (await getMissions()).futureMisions;
  return json({ missions: futureMissionList });
};

const index = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const toto = useLoaderData<LoaderData>();
  console.log(toto.missions);

  return (
    <>
      <div className="">
        {toto.missions.map((m) => {
          toto;
        })}
      </div>
    </>
  );
};

export default index;
