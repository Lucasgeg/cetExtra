import { json, LoaderFunction, redirect } from "@remix-run/node";
import React from "react";
import { adminOnly } from "~/components/AdminAuthorize";
import { getUser } from "~/utils/auth.server";
export const loader: LoaderFunction = async ({ request }) => {
  await adminOnly(request);
  return json({ message: "toto" });
};
const index = () => {
  return (
    <div>
      <h1>Toto</h1>
    </div>
  );
};

export default index;
