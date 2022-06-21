import { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  return true;
};

const index = async (test) => {
  console.log(test);

  return (
    <div>
      <h1>toto</h1>
    </div>
  );
};

export default index;
