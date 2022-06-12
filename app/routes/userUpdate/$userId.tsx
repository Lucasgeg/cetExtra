/* eslint-disable react-hooks/rules-of-hooks */
import { Statut } from "@prisma/client";
import { Role } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { getUserId } from "~/utils/auth.server";
import { getUserInformation, updateUser } from "~/utils/users.server";

type User = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  role: Role;
  statut: Statut;
  birthday: string | null;
  birthCity: string | null;
  workedTime: number | null;
  password: string | null;
  validatePassword: string | null;
};
type LoaderData = {
  user: User;
  consultingUserId: string;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const id = form.get("id");
  let email = form.get("email");
  let firstName = form.get("firstName");
  let lastName = form.get("lastName");
  let birthday = form.get("birthday");
  let birthCity = form.get("birthCity");
  let role = form.get("role");
  let statut = Number(form.get("statut"));
  let password = form.get("password");
  let validatePassword = form.get("validatePassword");

  const data = {
    email,
    firstName,
    lastName,
    birthCity,
    birthday,
    role,
    statut,
    password,
    validatePassword,
  };

  if (typeof id !== "string") throw new Error("Action error");

  // @ts-ignore
  return updateUser(id, data);
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const userId = params.userId;
  const consultingUserId = await getUserId(request);
  if (!userId) return json({ error: "No user Information here" });
  const userInfo = await getUserInformation(userId);

  return json({ user: userInfo, consultingUserId });
};

export default function userUpdate() {
  const data = useActionData();

  const [passType, setPassType] = useState("password");
  const [validatePassType, setValidatePassType] = useState("password");
  const changeValidPassType = () => {
    validatePassType == "password"
      ? setValidatePassType("text")
      : setValidatePassType("password");
  };
  const changePassType = () => {
    passType == "password" ? setPassType("text") : setPassType("password");
  };
  const { user, consultingUserId } = useLoaderData<LoaderData>();
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
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    birthday: user.birthday,
    birthCity: user.birthCity,
    workedTime: user.workedTime,
    role: user.role,
    statut: user.statut,
    password: undefined,
    validatePassword: undefined,
  });
  const rolesArray = Object.keys(Role) as (keyof typeof Role)[];
  const statutArray = Object.keys(Statut) as (keyof typeof Statut)[];
  return (
    <div className="w-full min-h-screen">
      <div className="relative top-1 left-1 w-28 p-8 bg-orange-200">
        <Link to={"/"}>Accueil</Link>
      </div>
      <h1>Hello user Info Page</h1>
      <div className="w-3/4 mx-auto bg-orange-200">
        <h2>
          Information de: {user.firstName} {user.lastName}
        </h2>
        <div className="PhotoAFaire mx-auto w-32 h-32 bg-white rounded-full mb-5"></div>
        {data?.error ? <p>{data?.error} </p> : null}
        {modify == false ? (
          <>
            <h2>
              email: <span> {user.email} </span>{" "}
            </h2>
            <h2>
              Date de naissance: <span> {user.birthday} </span>
            </h2>
            <h2>
              Ville de naissance: <span> {user.birthCity} </span>{" "}
            </h2>
            <h2>
              Role: <span>{user.role.toLowerCase()}</span>
            </h2>
            <h2>
              Temps de travail: <span>{user.workedTime}</span>
            </h2>
            {user.statut == "ADMIN" ? (
              <>
                <h2>
                  Statut: <span>{user.statut}</span>
                </h2>
              </>
            ) : null}
          </>
        ) : (
          <>
            <Form method="post">
              <label htmlFor="email">Email</label>
              <br />
              <input
                className="w-44"
                type="text"
                name="email"
                value={formData.email ? formData.email : ""}
                onChange={(e) => handleInputChange(e, "email")}
              />{" "}
              <br />
              {user.id == consultingUserId ? (
                <>
                  <label htmlFor="password">New Password</label>
                  <br />
                  <input
                    className="w-44"
                    type={passType}
                    name="password"
                    value={formData.password ? formData.password : undefined}
                    onChange={(e) => handleInputChange(e, "password")}
                  />{" "}
                  <span className="cursor-pointer" onClick={changePassType}>
                    {" "}
                    👁️{" "}
                  </span>
                  <br />
                  <label htmlFor="validatePassword">Password Validation</label>
                  <br />
                  <input
                    className="w-44"
                    type={validatePassType}
                    name="validatePassword"
                    value={
                      formData.validatePassword ? formData.validatePassword : ""
                    }
                    onChange={(e) => handleInputChange(e, "validatePassword")}
                  />
                  <span
                    className="cursor-pointer"
                    onClick={changeValidPassType}
                  >
                    {" "}
                    👁️{" "}
                  </span>
                </>
              ) : null}
              <br />
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
              <label htmlFor="birthCity">Birth City</label>
              <br />
              <input
                className="w-44"
                required={true}
                type="text"
                name="birthCity"
                value={formData.birthCity ? formData.birthCity : ""}
                onChange={(e) => handleInputChange(e, "birthCity")}
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
                  {/* <input
                    className="w-44"
                    required={true}
                    type="range"
                    min="1"
                    max="3"
                    name="statut"
                    value={formData.statut ? formData.statut : ""}
                    onChange={(e) => handleInputChange(e, "statut")}
                  /> */}
                </>
              ) : null}
              <br />
              <input type="hidden" name="id" value={user.id} />
              <button type="submit" name="_action" value={"valider"}>
                Valider
              </button>
              {console.log(data?.message)}
            </Form>
          </>
        )}
        <button onClick={handleModify}>Modifier</button>
      </div>
    </div>
  );
}
