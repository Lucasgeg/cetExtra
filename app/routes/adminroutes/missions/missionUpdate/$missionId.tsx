import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import { useState } from "react";
import { getUser } from "~/utils/auth.server";
import { getMissionInformation } from "~/utils/missions.server";

type Mission = {
  id: string;
  creatorId: string;
  missionName: string;
  beginAt: Date;
  endAt: Date;
  place: string;
  duration: string;
};

type User = {
  firstName: string;
  lastName: string;
};

type LoaderData = {
  mission: Mission;
  user: User;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const missionId = params.missionId;
  if (!missionId) return redirect("/routes/adminroutes/missionList");
  const consultingUser = await getUser(request);
  const mission = await getMissionInformation(missionId);
  if (consultingUser?.statut == "USER") return redirect("/");
  return json({ mission: mission, user: consultingUser });
};
//////////////////////////ACTION FUNCTION//////////////////////////
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get("_action");
  const missionName = form.get("missionName");
  const beginAt = form.get("beginAt");
  const endAt = form.get("endAt");
  const place = form.get("place");
};

const $missionId = () => {
  const { mission, user } = useLoaderData<LoaderData>();

  const [updateMode, setUpdateMode] = useState(false);
  const handleClick = () => {
    setUpdateMode(!updateMode);
  };
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };
  const [formData, setFormData] = useState({
    missionName: "",
    beginAt: "",
    endAt: "",
    place: "",
  });
  return (
    <div>
      <h1>
        Page d'information de la mission:
        <br /> {mission.missionName}
      </h1>
      {updateMode ? (
        <>
          <Form method="post">
            <label htmlFor="missionName">Nom de la mission</label>
            <input
              type="text"
              name="missionName"
              value={formData.missionName}
              onChange={(e) => handleInputChange(e, "missionName")}
            />
            <br />
            Horaires de la mission:
            <label htmlFor="beginAt">Début</label>
            <input
              type="datetime-local"
              name="beginAt"
              value={formData.beginAt}
              onChange={(e) => handleInputChange(e, "beginAt")}
            />{" "}
            <br />
            <label htmlFor="endAt">Fin</label>
            <input
              type="datetime-local"
              name="endAt"
              value={formData.endAt}
              onChange={(e) => handleInputChange(e, "endAt")}
            />{" "}
            <br />
            <label htmlFor="place">Lieu de la mission:</label>
            <input
              type="text"
              name="place"
              value={formData.place}
              onChange={(e) => handleInputChange(e, "place")}
            />
            <button type="submit" name="_action" value={"update"}>
              Valider
            </button>
          </Form>
        </>
      ) : (
        <>
          <div className="">
            Horaires de la mission:
            <div className="">
              <div className="">
                Début: <br />
                {format(new Date(mission.beginAt), "MM/dd/yyyy HH:mm")}
              </div>
              <div className="">
                Fin: <br />
                {format(new Date(mission.endAt), "MM/dd/yyyy HH:mm")}
              </div>
            </div>
            <p>
              Mission créer par: {user.firstName} {user.lastName}
            </p>
            <p>Lieu de la mission: {mission.place}</p>
            <p>Carte a venir</p>
            <p>Liste des extras:</p>
            <p>A venir</p>
          </div>
        </>
      )}
      <button onClick={handleClick}>Modifier</button>
    </div>
  );
};

export default $missionId;
