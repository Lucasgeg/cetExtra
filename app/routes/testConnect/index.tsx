import { useUser } from "@clerk/remix";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import { json, LoaderFunction, redirect } from "@remix-run/node";

export const loader: LoaderFunction = (args) => {
  return rootAuthLoader(
    args,
    ({ request }) => {
      const { userId } = request.auth;

      return { userId };
    },
    { loadUser: true }
  );
};

const index = () => {
  return (
    <div>
      <h1>Toto</h1>
    </div>
  );
};

export default index;
