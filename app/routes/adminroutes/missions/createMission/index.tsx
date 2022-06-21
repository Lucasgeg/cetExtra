import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { createMission } from "~/utils/missions.server";
import "@reach/combobox/styles.css";
import Menu from "~/components/Menu";
import CreateMissionForm from "~/components/CreateMissionForm";
import { getCurrentUser } from "~/utils/newAuth.server";
import Footer from "~/components/Footer";

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
  const user = await getCurrentUser(request);
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
      <h1 className="text-center text-xl my-2">
        cet Extra! Création de mission
      </h1>

      <CreateMissionForm />

      <div className=""></div>
      <Footer />
    </div>
  );
};

export default index;
