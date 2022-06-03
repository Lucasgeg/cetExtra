import { json, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import { useState } from "react";
import { getUser, getUserId } from "~/utils/auth.server";
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

const $missionId = () => {
  const { mission, user } = useLoaderData<LoaderData>();

  const [updateMode, setUpdateMode] = useState(false);
  const handleClick = () => {
    setUpdateMode(!updateMode);
  };
  const [formData, setFormData] = useState({});
  return (
    <div>
      <h1>
        Page d'information de la mission:
        <br /> {mission.missionName}
      </h1>
      {updateMode ? (
        <>
          <label>
            Nom de la mission
            <input type="text" name="missionName" />
          </label>
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