import type { LoaderFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import React from "react";
import LoginForm from "~/components/LoginForm";
import TestForm from "~/components/TestForm";

const index = () => {
  return (
    <div>
      <h1>Formulaire d'inscription</h1>
      <TestForm />
    </div>
  );
};

export default index;
