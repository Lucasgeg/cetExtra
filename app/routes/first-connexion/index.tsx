import { ClerkApp, useClerk, useUser, WithClerk } from "@clerk/remix";
import { Role } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useState } from "react";
import { createNewUser, userIsNew } from "~/utils/newAuth.server";

const birthdayValid = (birthday: string) => {
  if (!birthday) return "Birthday must be set";
};
const birthplaceValid = (birthplace: string) => {
  if (!birthplace) return "Birthplace must be set";
};

type ActionData = {
  formError?: string;
  fieldErrors?: {
    birthday: string;
    birthplace: string;
  };
  fields?: {
    birthday: string;
    birthplace: string;
  };
};

const badRequest = (data: ActionData) => {
  return json(data, { status: 400 });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const firstName = form.get("firstName");
  const lastName = form.get("lastName");
  const birthday = form.get("birthday");
  const birthplace = form.get("birthplace");
  const email = form.get("email");
  const authId = form.get("authId");
  const personnalAdress = form.get("personnalAdress");
  const picture = form.get("picture");
  const role = form.get("role");
  console.log(personnalAdress, picture, role);

  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof birthday !== "string" ||
    typeof birthplace !== "string" ||
    typeof email !== "string" ||
    typeof authId !== "string" ||
    typeof personnalAdress !== "string" ||
    typeof picture !== "string" ||
    typeof role !== "string"
  ) {
    return badRequest({
      formError: "Form is not correctly submitted",
    });
  }

  const fieldErrors = {
    birthday: birthdayValid(birthday),
    birthplace: birthplaceValid(birthplace),
  };
  const fields = { birthday, birthplace };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }
  const data = {
    firstName,
    lastName,
    birthday,
    birthplace,
    email,
    authId,
    personnalAdress,
    picture,
    role,
  };
  console.log(data);

  try {
    const userIsCreated = await createNewUser(data);
    if (!userIsCreated) throw new Error("User can't be created");
    return redirect("/");
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const loader: LoaderFunction = async ({ request }) => {
  const isNew = await userIsNew(request);
  if (!isNew) return redirect("/");

  return null;
};
export default function index() {
  //useHook on components
  return (
    <div className="">
      <h1>Bienvenue sur cet Extra</h1>
      <h3>
        Afin de finaliser ton inscription nous avons besoin de quelques infos
        supplémentaire, ne t'en fait pas, c'est pour pouvoir te faire un contrat
        de qualité!
      </h3>
      <FirstConnectForm />
    </div>
  );
}

const FirstConnectForm = () => {
  //récup info avec useUser
  const user = useUser().user;

  const actionData = useActionData<ActionData>();

  const [formData, setFormData] = useState({
    firstName: user.firstName !== "" ? user.firstName : "",
    lastName: user.lastName !== "" ? user.lastName : "",
    birthday: "",
    birthplace: "",
    picture: user.profileImageUrl !== "" ? user.profileImageUrl : "",
    personnalAdress: "",
    email: user.emailAddresses && user.emailAddresses[0].emailAddress,
    authId: user.id,
    role: "",
  });
  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };
  return (
    <>
      <Form method="post">
        {/* first Name */}
        <label htmlFor="firstName" className="label">
          Prénom
        </label>
        <br />
        <input
          type="text"
          placeholder="Prénom"
          className="input"
          value={formData.firstName}
          name={"firstName"}
          onChange={(e) => handleInputChange(e, "firstname")}
        />
        <br />
        {/* Last Name */}
        <label htmlFor="lastName" className="label">
          Nom
        </label>
        <br />
        <input
          type="text"
          placeholder="Nom"
          name="lastName"
          className="input"
          value={formData.lastName}
          onChange={(e) => handleInputChange(e, "lastName")}
        />{" "}
        <br />
        {/* Birthday */}
        <label htmlFor="birthday" className="label">
          Date de naissance
        </label>
        <br />
        <input
          type="date"
          placeholder=""
          className="input"
          name="birthday"
          value={formData.birthday}
          onChange={(e) => handleInputChange(e, "birthday")}
        />
        <br />
        <label htmlFor="personnalAdress">Adresse actuelle</label>
        <br />
        <input
          type="text"
          placeholder="1 rue du service"
          className="input"
          name="personnalAdress"
          value={formData.personnalAdress}
          onChange={(e) => handleInputChange(e, "personnalAdress")}
        />
        <br />
        {actionData?.fieldErrors?.birthplace && (
          <p>{actionData.fieldErrors.birthplace}</p>
        )}
        <label htmlFor="birthPlace">Lieu de naissance</label>
        <br />
        <input
          type="text"
          placeholder="Wakanda City"
          className="input"
          name="birthplace"
          value={formData.birthplace}
          onChange={(e) => handleInputChange(e, "birthplace")}
        />
        <br />
        {actionData?.fieldErrors?.birthplace && (
          <p>{actionData.fieldErrors.birthplace}</p>
        )}
        <label htmlFor="role">Tu es plutôt:</label>
        <br />
        <select
          name="role"
          id="role"
          value={formData.role}
          onChange={(e) => handleInputChange(e, "role")}
        >
          <option value="SALLE">{Role.SALLE}</option>
          <option value="CUISINE">{Role.CUISINE}</option>
          {/* {rolesArray.map((r) => {
            return (
              <option value={Role[r]} key={Role[r]}>
                {Role[r]}
              </option>
            );
          })} */}
        </select>
        <br />
        <br />
        <input type="hidden" name="email" value={formData.email} />
        <input type="hidden" name="picture" value={formData.picture} />
        <input type="hidden" name="authId" value={formData.authId} />
        <div className="text-right">
          <button
            type="submit"
            className="mt-3 p-2 bg-slate-400 rounded-lg w-16"
          >
            Valider
          </button>
        </div>
      </Form>
    </>
  );
};
