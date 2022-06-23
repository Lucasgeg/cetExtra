import type { Missions, Statut } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import Footer from "~/components/Footer";
import Menu from "~/components/Menu";
import MissionList from "~/components/MissionList";
import { getCurrentUser } from "~/utils/newAuth.server";
import { userMissions } from "~/utils/users.server";

type LoaderData = {
  userId: string;
  userFutureMissions: Missions[];
  userPastMissions: Missions[];
  userEmail: string;
  firstName: string;
  lastName: string;
  userStatut: Statut;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getCurrentUser(request);
  if (!user) return redirect("/");
  ///userInfos///
  const userId = user?.id;
  const userEmail = user?.email;
  const userPastMissions = (await userMissions(userId)).pastMissions;
  const userFutureMissions = (await userMissions(userId)).futureMisions;
  const firstName = user?.firstName;
  const lastName = user?.lastName;
  const userStatut = user.statut;
  const data: LoaderData = {
    userId,
    userFutureMissions,
    userPastMissions,
    userEmail,
    firstName,
    lastName,
    userStatut,
  };
  return json(data);
};

const index = () => {
  return (
    <div className="">
      <Menu />
      <MissionList />
      <Footer />
    </div>
  );
};

export default index;
