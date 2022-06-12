import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import MapComponent from "~/components/MapComponent";
import { getUser } from "~/utils/auth.server";
import { createMission } from "~/utils/missions.server";
import "@reach/combobox/styles.css";
import Menu from "~/components/Menu";

type LoaderData = {
  userStatut: string;
  userId: string;
};

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
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { userId, userStatut } = useLoaderData<LoaderData>();

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const actionData = useActionData();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [formData, setFormData] = useState({
    missionName: "",
    place: "",
    lat: null,
    lng: null,
    beginAt: "",
    endAt: "",
  });
  return (
    <div>
      <Menu statut={userStatut} />
      {actionData?.errorCreation ? (
        <>
          <p>{actionData?.errorCreation}</p>
        </>
      ) : null}
      <h1>Hello create Page!!!</h1>
      <h2>Nouvelle mission:</h2>
      <div className="">
        <Form method="post">
          <input type="hidden" name="creatorId" value={userId} />
          <label htmlFor="beginAt">date début:</label>
          <input
            type="datetime-local"
            name="beginAt"
            value={formData.beginAt}
            onChange={(e) => handleInputChange(e, "beginAt")}
            required
          />
          <br />
          {actionData?.errorTime ? (
            <>
              <p>{actionData?.errorTime}</p>
            </>
          ) : null}
          <label htmlFor="endAt">Date fin:</label>
          <input
            type="datetime-local"
            name="endAt"
            value={formData.endAt}
            onChange={(e) => handleInputChange(e, "endAt")}
            required
          />
          <br />
          {actionData?.errorTime ? (
            <>
              <p>{actionData?.errorTime}</p>
            </>
          ) : null}
          <label htmlFor="missionName">Nom de la mission:</label>
          <input
            type="text"
            name="missionName"
            value={formData.missionName}
            onChange={(e) => handleInputChange(e, "missionName")}
          />
          <br />
          {actionData?.errorName ? (
            <>
              <p>{actionData?.errorName}</p>
            </>
          ) : null}
          <MapComponent
            search={true}
            formData={formData}
            setFormData={setFormData}
          />

          <input type="hidden" value={formData.place} name="place" />
          <input type="hidden" value={formData.lat} name="lat" />
          <input type="hidden" value={formData.lng} name="lng" />
          <button type="submit" name="_action" value={"create"}>
            créer
          </button>
        </Form>
      </div>
    </div>
  );
};

export default index;
