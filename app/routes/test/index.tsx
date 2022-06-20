import { LoaderFunction } from "@remix-run/node";
import React from "react";
import { toto } from "./testSubmit";

export const loader: LoaderFunction = async () => {
  const bobo = await toto("bobo");
  console.log(bobo);

  return true;
};

const index = () => {
  return (
    <div>
      <h1>toto</h1>
    </div>
  );
};

export default index;
