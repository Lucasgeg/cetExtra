import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useState } from "react";
import { getUser, login, register } from "~/utils/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  return (await getUser(request)) ? redirect("/") : null;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const email = form.get("email");
  const password = form.get("password");
  const validatePassword = form.get("validatePassword");
  const firstName = form.get("firstName");
  const lastName = form.get("lastName");
  const birthday = form.get("birthday");
  const birthCity = form.get("birthCity");
  const action = form.get("_action");

  switch (action) {
    case "register":
      if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        typeof validatePassword !== "string" ||
        typeof birthCity !== "string" ||
        typeof birthday !== "string" ||
        typeof firstName !== "string" ||
        typeof lastName !== "string"
      ) {
        throw new Error("typeError");
      }
      const data = {
        email,
        password,
        validatePassword,
        birthday,
        birthCity,
        firstName,
        lastName,
      };
      return await register({
        ...data,
      });
    case "connect": {
      if (typeof email !== "string" || typeof password !== "string") {
        throw new Error("typeError");
      }

      const data = { email, password };
      return await login({ ...data });
    }
    default: {
      return json({ error: "actionError" });
    }
  }
};

export default function Login() {
  const actionData = useActionData();
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    validatePassword: "",
    birthday: "",
    birthCity: "",
    firstName: "",
    lastName: "",
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
            className="w-44"
            type="text"
            name="email"
            value={formData.email}
            onChange={(e) => handleInputChange(e, "email")}
          />{" "}
          <br />
          <label htmlFor="password">Password</label>
          <br />
          <input
            className="w-44"
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
                className="w-44"
                type="password"
                name="validatePassword"
                value={formData.validatePassword}
                onChange={(e) => handleInputChange(e, "validatePassword")}
              />{" "}
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
            </>
          ) : null}
          <button
            type="submit"
            name="_action"
            value={action == "connect" ? "connect" : "register"}
          >
            Submit
          </button>
        </Form>
      </div>
    </div>
  );
}
