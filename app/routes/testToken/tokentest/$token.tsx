import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import { getUser } from "~/utils/auth.server";
import { validateMissionToken } from "~/utils/userMissions.server";

export const loader: LoaderFunction = async ({ params, request }) => {
  //page en lien par mail avec token
  const token = params.token; // recup du token

  const user = await getUser(request);
  //recup user
  //si token == user.token

  await validateMissionToken(user.email, token);

  //update user
  //message d'erreur
  return true;
};

const token = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return (
    <div>
      <h1>toto</h1>
    </div>
  );
};

export default token;
