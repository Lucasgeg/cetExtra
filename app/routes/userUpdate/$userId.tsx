/* eslint-disable react-hooks/rules-of-hooks */
import type { Missions } from "@prisma/client";
import { Statut } from "@prisma/client";
import { Role } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import Menu from "~/components/Menu";
import { getCurrentUser } from "~/utils/newAuth.server";
import { disconnectToMission } from "~/utils/userMissions.server";
import {
  getUserInformation,
  updateUser,
  userMissions,
} from "~/utils/users.server";

type User = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  role: Role;
  statut: Statut;
  birthday: string | null;
  birthplace: string | null;
  workedTime: number | null;
  password: string | null;
  validatePassword: string | null;
};
type LoaderData = {
  user: User;
  consultingUserId: string;
  userFutureMission: Missions[];
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const id = form.get("id").toString();
  let email = form.get("email").toString();
  let firstName = form.get("firstName");
  let lastName = form.get("lastName");
  let birthday = form.get("birthday");
  let birthplace = form.get("birthplace");
  let role = form.get("role");
  let statut = Number(form.get("statut"));
  let password = form.get("password");
  let validatePassword = form.get("validatePassword");
  const missionId = form.get("missionId").toString();
  const action = form.get("_action");
  const data = {
    email,
    firstName,
    lastName,
    birthplace,
    birthday,
    role,
    statut,
    password,
    validatePassword,
  };
  switch (action) {
    case "update": {
      if (typeof id !== "string") throw new Error("Action error");

      // @ts-ignore
      return updateUser(id, data);
    }
    case "removeFromMission": {
      return await disconnectToMission(email, missionId);
    }
    default:
      throw new Error("Erreur actionData/UserId");
  }
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const userId = params.userId;
  const consultingUserId = (await getCurrentUser(request)).id;
  if (!userId) return json({ error: "No user Information here" });
  const userInfo = await getUserInformation(userId);
  const userFutureMission = (await userMissions(userId)).futureMisions;
  return json({ user: userInfo, consultingUserId, userFutureMission });
};

export default function userUpdate() {
  //TODO tableau liste des prochaines missions
  const data = useActionData();
  const { user, userFutureMission } = useLoaderData<LoaderData>();
  const handleModify = () => {
    setModify(!modify);
  };
  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };
  const [modify, setModify] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    birthday: user.birthday,
    birthplace: user.birthplace,
    workedTime: user.workedTime,
    role: user.role,
    statut: user.statut,
  });
  const rolesArray = Object.keys(Role) as (keyof typeof Role)[];
  const statutArray = Object.keys(Statut) as (keyof typeof Statut)[];

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
  return (
    <div className="w-full min-h-screen">
      <Menu />
      <div className="w-3/4 mx-auto bg-orange-200 p-5 mt-5">
        <h2 className="text-center text-4xl mb-3">
          Information de: {user.firstName} {user.lastName}
        </h2>
        {/* TODO photo à récup de clerk */}
        <div className="PhotoAFaire mx-auto w-32 h-32 bg-white rounded-full mb-5"></div>
        {data?.error ? <p>{data?.error} </p> : null}
        <div className="flex">
          <div className="w-1/2">
            {modify == false ? (
              <>
                <h2 className="font-semibold underline">Email:</h2>{" "}
                <span> {user.email} </span>{" "}
                <h2 className="font-semibold underline">Date de naissance:</h2>{" "}
                <span> {user.birthday} </span>
                <h2 className="font-semibold underline">
                  Ville de naissance:
                </h2>{" "}
                <span> {user.birthplace} </span>{" "}
                <h2 className="font-semibold underline">Role:</h2>{" "}
                <span>{user.role.toLowerCase()}</span>
                <h2 className="font-semibold underline">
                  Temps de travail:
                </h2>{" "}
                <span>{user.workedTime}</span>
                {user.statut == "ADMIN" ? (
                  <>
                    <h2 className="font-semibold underline">Statut:</h2>{" "}
                    <span>{user.statut}</span>
                  </>
                ) : null}
              </>
            ) : (
              <>
                <Form method="post">
                  <label htmlFor="firstName">Prénom</label>
                  <br />
                  <input
                    className="w-44"
                    type="text"
                    name="firstName"
                    value={formData.firstName ? formData.firstName : ""}
                    onChange={(e) => handleInputChange(e, "firstName")}
                  />
                  <br />
                  <label htmlFor="lastName">Nom</label>
                  <br />
                  <input
                    className="w-44"
                    type="text"
                    name="lastName"
                    value={formData.lastName ? formData.lastName : ""}
                    onChange={(e) => handleInputChange(e, "lastName")}
                  />
                  <br />
                  <label htmlFor="birthday">Date de naissance</label>
                  <br />
                  <input
                    className="w-44"
                    required={true}
                    type="date"
                    name="birthday"
                    value={formData.birthday ? formData.birthday : ""}
                    onChange={(e) => handleInputChange(e, "birthday")}
                  />{" "}
                  <br />
                  <label htmlFor="birthplace">Ville de naissance</label>
                  <br />
                  <input
                    className="w-44"
                    required={true}
                    type="text"
                    name="birthplace"
                    value={formData.birthplace ? formData.birthplace : ""}
                    onChange={(e) => handleInputChange(e, "birthplace")}
                  />{" "}
                  <br />
                  {user.statut !== "USER" ? (
                    <>
                      <label htmlFor="role">Role</label>
                      <br />
                      <select
                        name="role"
                        id="role"
                        value={formData.role}
                        onChange={(e) => handleInputChange(e, "role")}
                      >
                        {rolesArray.map((r) => {
                          return (
                            <option value={Role[r]} key={Role[r]}>
                              {Role[r]}
                            </option>
                          );
                        })}
                      </select>
                      <br />
                      <label htmlFor="statut">Statut: {formData.statut} </label>
                      <br />
                      <select
                        name="statut"
                        id="statut"
                        value={formData.statut}
                        onChange={(e) => handleInputChange(e, "statut")}
                      >
                        {statutArray.map((s) => {
                          return (
                            <option value={Statut[s]} key={Statut[s]}>
                              {Statut[s]}
                            </option>
                          );
                        })}
                      </select>
                    </>
                  ) : null}
                  <br />
                  <input type="hidden" name="id" value={user.id} />
                  <button
                    type="submit"
                    name="_action"
                    value={"update"}
                    className="bg-slate-400 p-2 rounded mt-2"
                  >
                    Valider
                  </button>
                  {console.log(data?.message)}
                </Form>
              </>
            )}{" "}
            <br />
            <button
              onClick={handleModify}
              className="bg-slate-400 p-2 rounded mt-2"
            >
              {modify ? "Retour" : "Modifier"}
            </button>
          </div>
          <div className="w-1/4 border border-black ml-auto p-2 h-fit">
            <h3 className="text-center underline font-semibold">
              Prochaines missions
            </h3>
            <ul>
              {userFutureMission.map((mission) => (
                <li key={mission.id} className="">
                  <div className="flex justify-between">
                    {
                      <Link
                        to={`/adminroutes.missions/mission-information/${mission.id}`}
                      >
                        {mission.missionName}
                      </Link>
                    }
                    <Form
                      method="post"
                      onSubmit={(e) => deleteValidationUserFromMission(e)}
                    >
                      <input type="hidden" name="email" value={user.email} />
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
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
