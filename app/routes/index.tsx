import type { Statut } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Logout from "~/components/Logout";
import Menu from "~/components/Menu";
import { getUser } from "~/utils/auth.server";

type LoaderData = {
  userId: string | undefined;
  email: string | undefined;
  birthCity: string | undefined;
  birthday: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  statut: Statut;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (!user) return redirect("/login");
  ///userInfos///
  const userId = user?.id;
  const email = user?.email;
  const birthCity = user?.birthCity;
  const birthday = user?.birthday;
  const firstName = user?.firstName;
  const lastName = user?.lastName;
  const statut = user.statut;
  const data: LoaderData = {
    userId,
    birthCity,
    birthday,
    email,
    firstName,
    lastName,
    statut,
  };
  return json(data);
};

export default function Index() {
  const { email, firstName, statut } = useLoaderData<LoaderData>();
  return (
    <div className="text-white min-h-screen">
      <Menu statut={statut} />
      <h1>Hello {firstName}</h1>
      <h2>Ceci est la page d'accueil une fois connecté</h2>

      <Logout email={email} />
    </div>
  );
}
