import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUser } from "~/utils/auth.server";
import { getToken } from "./test.server";

export const loader: LoaderFunction = async ({ request }) => {
  const toto = (await getUser(request)).id;
  const tokenJwt = await getToken(toto);

  return json({ tokenJwt });
};

const index = () => {
  return (
    <div>
      <h1>Token secret:</h1>
      <Toto />
    </div>
  );
};

export default index;

const Toto = () => {
  const { tokenJwt } = useLoaderData();
  return <div className="">{tokenJwt}</div>;
};
