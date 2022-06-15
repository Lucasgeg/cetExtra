import type { LoaderFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import React from "react";
import LoginForm from "~/components/LoginForm";

export const loader: LoaderFunction = async ({ request }) => {
  return true;
};

const index = () => {
  return (
    <div>
      <h1>Formulaire d'inscription</h1>
      <LoginForm />
    </div>
  );
};

export default index;
