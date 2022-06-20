import { json } from "@remix-run/node";
import { ThrownResponse } from "@remix-run/react";

export type NotFoundResponse = ThrownResponse<404, string>;

export const toto = async (data: string) => {
  if (data !== "toto") throw json("Not found", { status: 404 });
  return json("bravo");
};
