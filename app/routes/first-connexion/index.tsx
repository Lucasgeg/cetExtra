import { useUser } from "@clerk/remix";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useState } from "react";
import { createNewUser } from "~/utils/newAuth.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const firstName = form.get("firstName");
  const lastName = form.get("lastName");
  const birthday = form.get("birthday");
  const birthplace = form.get("birthplace");
  const email = form.get("email");
  const authId = form.get("authId");
  console.log(firstName, lastName, birthday, birthplace, email);

  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof birthday !== "string" ||
    typeof birthplace !== "string" ||
    typeof email !== "string" ||
    typeof authId !== "string"
  )
    throw new Error("type Error");
  const data = { firstName, lastName, birthday, birthplace, email, authId };
  return await createNewUser(data)
    .then((value) => {
      console.log(value);
      return json({ value });
    })
    .catch((error) => {
      console.log(error);
      return json({ error });
    });
};

export default function index() {
  //useHook on components
  return (
    <div className="h-screen">
      <h1>Bienvenue sur cet Extra</h1>
      <h3>
        Afin de finaliser ton inscription nous avons besoin de quelques infos
        supplémentaire:
      </h3>
      <FirstConnectForm />
    </div>
  );
}

const FirstConnectForm = () => {
  //récup info avec useUser
  const user = useUser().user;

  const [formData, setFormData] = useState({
    firstName: user.firstName && user.firstName,
    lastName: user.lastName && user.lastName,
    birthday: "",
    birthplace: "",
    email: user.emailAddresses && user.emailAddresses[0].emailAddress,
    authId: user.id,
  });
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
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
        />{" "}
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
        />{" "}
        <br />
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
        <input type="hidden" name="email" value={formData.email} />
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
