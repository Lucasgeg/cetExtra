import { Missions } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React, { useState } from "react";
import FullMapComponent from "~/components/FullMapComponent";
import MapComponent from "~/components/MapComponent";
import { getMissions } from "~/utils/missions.server";
import { getCurrentUser } from "~/utils/newAuth.server";

type LoaderData = {
  missions: Missions[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getCurrentUser(request);
  const missions = (await getMissions()).futureMisions;
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  return json({ user, missions, apiKey });
};

const index = () => {
  return (
    <div>
      <h1>A faire: </h1>
      <p>récupéré un tableau de toute les missions</p>
      <p>les mappé pour placé plusieurs markers</p>
      <FullMapComponent />
    </div>
  );
};

export default index;
