import { LoaderFunction } from "@remix-run/node";
import CetExtraInvitation from "~/components/CetExtraInvitation";
import { getUserList } from "~/utils/users.server";

export const loader: LoaderFunction = async ({ params, request }) => {
  const userList = (await getUserList()).userList;

  return userList;
};

const index = () => {
  return (
    <div>
      <CetExtraInvitation />
    </div>
  );
};

export default index;
