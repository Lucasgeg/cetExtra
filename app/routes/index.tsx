import { json, LoaderFunction, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Logout from "~/components/Logout";
import Menu from "~/components/Menu";
import { getUser, getUserId } from "~/utils/auth.server";

type LoaderData = {
  userId: string | undefined;
  email: string | undefined;
  birthCity: string | undefined;
  birthday: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  statut: number;
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
  const { birthCity, birthday, email, firstName, lastName, userId, statut } =
    useLoaderData<LoaderData>();
  return (
    <div className="text-white min-h-screen">
      <h1>Hello {firstName}</h1>
      <h2>Ceci est la page d'accueil une fois connecté</h2>
      <Link to={"/login"}>
        {" "}
        <button>login</button>{" "}
      </Link>
      <Logout email={email} />
      <Menu statut={statut} />
    </div>
  );
}
