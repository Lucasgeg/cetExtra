import { ActionFunction, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useState } from "react";
import { register } from "~/utils/auth.server";

type Data = {
  email: string;
  password: string;
  validatePassword: string;
  birthday: string;
  birthCity: string;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const email = form.get("email");
  const password = form.get("password");
  const validatePassword = form.get("validatePassword");
  const birthday = form.get("birthday");
  const birthCity = form.get("birthCity");
  const action = form.get("_action");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof validatePassword !== "string" ||
    typeof birthCity !== "string" ||
    typeof birthday !== "string"
  ) {
    throw new Error();
  }
  const data = { email, password, validatePassword, birthday, birthCity };
  return await register({
    ...data,
  });
};

export default function Login() {
  const actionData = useActionData();
  /////////////////typage a faire, formdata/////////////////
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form: Data) => ({ ...form, [field]: event.target.value }));
  };
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    validatePassword: "",
    birthday: "",
    birthCity: "",
  });
  const [action, setAction] = useState("connect");
  return (
    <div className="h-screen formContainer flex flex-col w-1/2 justify-center items-center  text-center mx-auto text-blue-500 ">
      <button
        onClick={() => setAction(action == "connect" ? "register" : "connect")}
      >
        {action == "connect" ? "S'inscrire" : "Connexion"}{" "}
      </button>
      <h1 className="text-center text-5xl mb-5">Hello Login Page</h1>
      <div className="formContainer flex flex-col w-1/2 justify-center items-center  text-center">
        {actionData?.error ? <p>{actionData?.error} </p> : null}
        <Form method="post">
          <label htmlFor="email">Email</label>
          <br />
          <input
            className=""
            type="text"
            name="email"
            value={formData.email}
            onChange={(e) => handleInputChange(e, "email")}
          />{" "}
          <br />
          <label htmlFor="password">Password</label>
          <br />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={(e) => handleInputChange(e, "password")}
          />{" "}
          <br />
          {action == "register" ? (
            <>
              <label htmlFor="validatePassword">Password Validation</label>
              <br />
              <input
                type="password"
                name="validatePassword"
                value={formData.validatePassword}
                onChange={(e) => handleInputChange(e, "validatePassword")}
              />{" "}
              <br />
              <label htmlFor="birthday">Birthday</label>
              <br />
              <input
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
                required={true}
                type="text"
                name="birthCity"
                value={formData.birthCity}
                onChange={(e) => handleInputChange(e, "birthCity")}
              />{" "}
              <br />
            </>
          ) : null}
          <button
            type="submit"
            name="_Action"
            value={action == "connect" ? "connect" : "register"}
          >
            Submit
          </button>
        </Form>
      </div>
    </div>
  );
}
