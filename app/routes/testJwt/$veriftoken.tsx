import { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request, params }) => {
  const receivedToken = params.veriftoken;
  console.log(receivedToken);

  return true;
};

const veriftoken = () => {
  return (
    <div>
      <h1>TOTO</h1>
    </div>
  );
};

export default veriftoken;
