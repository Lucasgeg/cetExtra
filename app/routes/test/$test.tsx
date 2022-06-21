import { LoaderFunction, redirect } from "@remix-run/node";
import React from "react";

export const loader: LoaderFunction = async ({ request, params }) => {
  const test = params.test;
  console.log(test);

  if (test) return redirect("/test");
};

const $test = () => {
  return (
    <div>
      <h1>blabla</h1>
    </div>
  );
};

export default $test;
