import { json, LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { getUserId } from "~/utils/auth.server";
import { getUserInformation } from "~/utils/users.server";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  statut: number;
  birthday: string;
  birthCity: string;
  workedTime: number;
  password: string;
  validatePassword: string;
};
type LoaderData = {
  user: User;
  consultingUserId: string;
};
export const loader: LoaderFunction = async ({ params, request }) => {
  const userId = params.userId;
  const consultingUserId = await getUserId(request);
  if (!userId) return json({ error: "No user Information here" });
  const userInfo = await getUserInformation(userId);

  return json({ user: userInfo, consultingUserId });
};

export default function userUpdate() {
  const { user, consultingUserId } = useLoaderData<LoaderData>();

  const handleModify = () => {
    setModify(!modify);
  };
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
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
    password: "",
    validatePassword: "",
  });
  return (
    <div className="w-full min-h-screen">
      <h1>Hello user Info Page</h1>
      <div className="w-3/4 mx-auto bg-orange-200">
        <h2>
          Information de: {user.firstName} {user.lastName}
        </h2>
        <div className="PhotoAFaire mx-auto w-32 h-32 bg-white rounded-full mb-5"></div>
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
              Temps de travail: <span>{user.workedTime}</span>
            </h2>
            {user.statut == 1 ? (
              <>
                <h2>
                  Role: <span>{user.role}</span>
                </h2>
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
                value={formData.email}
                onChange={(e) => handleInputChange(e, "email")}
              />{" "}
              <br />
              {user.id == consultingUserId ? (
                <>
                  <label htmlFor="password">New Password</label>
                  <br />
                  <input
                    className="w-44"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange(e, "password")}
                  />
                  <br />
                  <label htmlFor="validatePassword">Password Validation</label>
                  <br />
                  <input
                    className="w-44"
                    type="password"
                    name="validatePassword"
                    value={formData.validatePassword}
                    onChange={(e) => handleInputChange(e, "validatePassword")}
                  />{" "}
                </>
              ) : null}
              <br />
              <label htmlFor="firstName">Prénom</label>
              <br />
              <input
                className="w-44"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange(e, "firstName")}
              />
              <br />
              <label htmlFor="lastName">Nom</label>
              <br />
              <input
                className="w-44"
                type="text"
                name="lastName"
                value={formData.lastName}
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
                value={formData.birthday}
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
                value={formData.birthCity}
                onChange={(e) => handleInputChange(e, "birthCity")}
              />{" "}
              <br />
              <button type="submit" name="_action" value={"valider"}>
                Valider
              </button>
              <button type="reset">Annuler</button>
            </Form>
          </>
        )}
        <button onClick={handleModify}>Modifier</button>
      </div>
    </div>
  );
}
