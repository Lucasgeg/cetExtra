import type { Statut } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import { useState } from "react";
import MapComponent from "~/components/MapComponent";
import Menu from "~/components/Menu";
import { getUser } from "~/utils/auth.server";
import { getMissionInformation, updateMission } from "~/utils/missions.server";
import { disconnectToMission } from "~/utils/userMissions.server";

type Mission = {
  id: string;
  creatorId: string;
  missionName: string;
  beginAt: string;
  endAt: string;
  place: string;
  duration: string;
  lat: number;
  lng: number;
  users: User[];
};

type User = {
  firstName: string;
  lastName: string;
  statut: Statut;
  email: string;
  id: string;
};

type LoaderData = {
  mission: Mission;
  user: User;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const missionId = params.missionId;
  if (!missionId) return redirect("/routes/adminroutes/missionList");
  const consultingUser = await getUser(request);
  const userStatut = consultingUser.statut;
  const mission = await getMissionInformation(missionId);
  if (consultingUser?.statut == "USER") return redirect("/");
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return console.log("ApiKey is Needed!");

  return json({
    mission: mission,
    user: consultingUser,
    apiKey: apiKey,
    userStatut,
  });
};
//////////////////////////ACTION FUNCTION//////////////////////////
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const id = form.get("missionId");
  const missionName = form.get("missionName");
  const beginAt = form.get("beginAt");
  const endAt = form.get("endAt");
  const place = form.get("place");
  const lat = +form.get("lat");
  const lng = +form.get("lng");
  const action = form.get("_action");
  const userEmail = form.get("userId");
  switch (action) {
    case "update": {
      try {
        if (typeof id !== "string") throw new Error("Pas d'id");
        const data = { missionName, beginAt, endAt, place, lat, lng };
        // @ts-ignore
        return updateMission(id, data);
      } catch (error) {
        throw new Error(error);
      }
    }
    case "removeFromMission": {
      return await disconnectToMission(userEmail, id);
    }
    default: {
      throw new Error("Action Error!");
    }
  }
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
  const deleteValidationUserFromMission = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    const answer = prompt(
      "Merci de valider la suppression en écrivant SUPPRIMER"
    );
    if (!answer || answer !== "SUPPRIMER") {
      alert("Erreur, pas suppression");
      e.preventDefault();
      return false;
    }
  };
  const [formData, setFormData] = useState({
    id: mission.id,
    missionName: mission.missionName,
    beginAt: mission.beginAt,
    endAt: mission.endAt,
    place: mission.place,
    lat: mission.lat,
    lng: mission.lng,
  });

  return (
    <div className="h-screen w-full">
      <Menu />
      <h1>
        Page d'information de la mission:
        <br /> {mission.missionName}
      </h1>
      <div className="lg:flex">
        <div className="w-1/2">
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
                <MapComponent
                  formData={formData}
                  setFormData={setFormData}
                  search={true}
                />
                <input type="hidden" value={formData.id} name="missionId" />
                <input type="hidden" value={formData.place} name="place" />
                <input type="hidden" value={formData.lat} name="lat" />
                <input type="hidden" value={formData.lng} name="lng" />
                {/* <label htmlFor="place">Lieu de la mission:</label>
            <input
              type="text"
              name="place"
              value={formData.place}
              onChange={(e) => handleInputChange(e, "place")}
            /> */}
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
                    {format(new Date(mission.beginAt), "dd/MM/yyyy HH:mm")}
                  </div>
                  <div className="">
                    Fin: <br />
                    {format(new Date(mission.endAt), "dd/MM/yyyy HH:mm")}
                  </div>
                </div>
                <p>
                  Mission créer par: {user.firstName} {user.lastName}
                </p>
                <p>Lieu de la mission: {mission.place}</p>
                <MapComponent
                  formData={formData}
                  setFormData={setFormData}
                  search={false}
                />
                {user.statut !== "USER" && (
                  <button onClick={handleClick}>Modifier</button>
                )}
              </div>
            </>
          )}
        </div>
        <div className="w-1/2">
          <p>Liste des extras:</p>
          <table className="w-1/2 mx-auto">
            <thead>
              <tr>
                <th colSpan={2}>Liste des Extra</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Extras</th>
                <th>Actions</th>
              </tr>
              {mission.users.map((user) => (
                <tr key={user.email}>
                  <td className="text-center">
                    {
                      <Link to={`/userUpdate/${user.id}`}>
                        {user.lastName + " " + user.firstName}
                      </Link>
                    }{" "}
                  </td>
                  <td className="flex justify-around">
                    <Link to={`/userUpdate/${user.id}`}>👁</Link>
                    <Form
                      method="post"
                      onSubmit={(e) => deleteValidationUserFromMission(e)}
                    >
                      <input type="hidden" name="userId" value={user.email} />
                      <input
                        type="hidden"
                        name="missionId"
                        value={mission.id}
                      />
                      <button
                        type="submit"
                        name="_action"
                        value={"removeFromMission"}
                      >
                        ❌
                      </button>
                    </Form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default $missionId;
