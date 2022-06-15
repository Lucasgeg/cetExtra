import type { ActionFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import React from "react";
import LoginForm from "~/components/LoginForm";
import TestForm from "~/components/TestForm";
import { sendMail } from "~/utils/sendMail.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get("email").toString();
  const message = form.get("message").toString();
  const data = { email, message };
  await sendMail(data);
  /*  const data = { email, message };
  const response = await fetch("/test/testSubmit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (response.ok) {
    console.log("ok");
  } else {
    console.log("Error");
  } */
  return true;
};

const index = () => {
  return (
    <div>
      <h1>Formulaire de test</h1>
      <TestForm />
    </div>
  );
};

export default index;
