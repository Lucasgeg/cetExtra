import { ActionFunction, Response } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { streamToBuffer } from "~/utils/stream";
import { generatePdf } from "../test";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const name = form.get("toto").toString();
  // récupère l'id de l'user et la mission pour le contrat
  // tu envoies les params à generatePdf
  const myPdfStream = await generatePdf({ name });
  const myPdfBuffer = await streamToBuffer(myPdfStream);

  return new Response(myPdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
    },
  });
};

const MyDoc = () => {
  return (
    <Form method="post">
      <input type="submit" value={"toto"} />
      <input type="text" name="toto" />
    </Form>
  );
};

export default MyDoc;
