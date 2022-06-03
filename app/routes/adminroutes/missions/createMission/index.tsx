import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { getUser } from "~/utils/auth.server";
import { createMission } from "~/utils/missions.server";

type LoaderData = {
  userStatut: string;
  userId: string;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const creatorId = form.get("creatorId");
  const missionName = form.get("missionName");
  const place = form.get("place");
  const begin = form.get("beginAt");
  const end = form.get("endAt");

  if (
    typeof creatorId !== "string" ||
    typeof missionName !== "string" ||
    typeof place !== "string" ||
    typeof begin !== "string" ||
    typeof end !== "string"
  )
    throw new Error("type Error");
  const beginAt = new Date(begin);
  const endAt = new Date(end);
  const data = { creatorId, missionName, place, beginAt, endAt };
  return await createMission({ ...data });
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (!user) return redirect("/login");
  if (user.statut !== "ADMIN") return redirect("/");
  const userId = user.id;
  return json({ userId });
};

const index = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { userId } = useLoaderData<LoaderData>();
  const dateFormat = new Date();
  const dateNow = dateFormat.toISOString();

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const actionData = useActionData();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [formData, setFormData] = useState({
    missionName: "",
    place: "",
    begintAt: "",
    endAt: "",
  });
  return (
    <div>
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
            value={formData.begintAt}
            onChange={(e) => handleInputChange(e, "begintAt")}
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
          <label htmlFor="place">Lieu de mission:</label>
          <input
            type="text"
            name="place"
            value={formData.place}
            onChange={(e) => handleInputChange(e, "place")}
          />
          <br />
          {actionData?.errorPlace ? (
            <>
              <p>{actionData?.errorPlace}</p>
            </>
          ) : null}
          <button type="submit" name="_action" value={"create"}>
            créer
          </button>
        </Form>
      </div>
    </div>
  );
};

export default index;
