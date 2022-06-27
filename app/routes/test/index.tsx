import { renderToFile } from "@react-pdf/renderer";
import { LoaderFunction } from "@remix-run/node";
import React from "react";
import Test from "./test";

export const loader: LoaderFunction = async ({ request }) => {
  return await renderToFile(<Test />, "contracts/myPdfTest.pdf");
};
