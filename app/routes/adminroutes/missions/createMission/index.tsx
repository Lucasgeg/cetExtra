import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import MapComponent from "~/components/MapComponent";
import { getUser } from "~/utils/auth.server";
import { createMission } from "~/utils/missions.server";
import "@reach/combobox/styles.css";
import Menu from "~/components/Menu";
import CreateMissionForm from "~/components/CreateMissionForm";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const creatorId = form.get("creatorId");
  const missionName = form.get("missionName");
  const place = form.get("place");
  const beginAt = form.get("beginAt");
  const endAt = form.get("endAt");
  const lat = +form.get("lat");
  const lng = +form.get("lng");

  if (
    typeof lat !== "number" ||
    typeof lng !== "number" ||
    typeof creatorId !== "string" ||
    typeof missionName !== "string" ||
    typeof place !== "string" ||
    typeof beginAt !== "string" ||
    typeof endAt !== "string"
  )
    throw new Error("type Error");

  const data = { creatorId, missionName, place, beginAt, endAt, lat, lng };
  return await createMission({ ...data });
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (!user) return redirect("/login");
  if (user.statut !== "ADMIN") return redirect("/");
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const userId = user.id;
  const userStatut = user.statut;
  return json({ userId, apiKey, userStatut });
};

const index = () => {
  return (
    <div>
      <Menu />
      <h1>Hello create Page!!!</h1>
      <h2>Nouvelle mission:</h2>
      <div className="w-2/3 mx-auto flex">
        <CreateMissionForm />
      </div>
      <div className=""></div>
    </div>
  );
};

export default index;
