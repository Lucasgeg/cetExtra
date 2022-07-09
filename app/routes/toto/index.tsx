import { LoaderFunction } from "@remix-run/node";
import { toto } from "~/utils/userMissions.server";

export const loader: LoaderFunction = async (request) => {
  const userMail = "sulac@live.fr";
  const missionId = "62c5a901bfecae10b39a1e4a";
  await toto(userMail, missionId);
  return true;
};

const index = () => {
  return (
    <div>
      <h1>toto</h1>
    </div>
  );
};

export default index;
