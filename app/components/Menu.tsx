import { SignedIn, SignOutButton, UserButton } from "@clerk/remix";
import type { Statut } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
type LoaderData = {
  userStatut: Statut;
  userId: string;
};
const Menu = () => {
  const { userId, userStatut } = useLoaderData<LoaderData>();

  return (
    <div className="mt-10">
      {userStatut !== "USER" ? (
        <nav className="admin_Menu flex items-center w-full justify-around">
          <Link to={"/"} className="w-28 h-14 flex bg-orange-200 rounded-lg">
            <div className="m-auto">Accueil</div>
          </Link>
          <Link
            to={"/adminroutes/userList"}
            className="w-28 h-14 flex bg-orange-200 rounded-lg"
          >
            <div className="m-auto">User List</div>
          </Link>
          <Link
            to="/adminroutes/missions"
            className="w-28 h-14 flex bg-orange-200 rounded-lg"
          >
            <div className="m-auto">Missions</div>
          </Link>
          <div className="absolute top-2 left-2">
            <SignedIn>
              <UserButton /> <br />
              <div className="w-fit p-2 bg-orange-300 rounded-md">
                <SignOutButton />
              </div>
            </SignedIn>
          </div>
        </nav>
      ) : (
        <nav className="admin_Menu flex items-center w-full justify-around">
          <Link to={"/"} className="w-28 h-14 flex bg-orange-200 rounded-lg">
            <div className="m-auto">Accueil</div>
          </Link>
          <Link
            to={"/userroutes/missions"}
            className="w-28 h-14 flex bg-orange-200 rounded-lg"
          >
            <div className="m-auto">Mes Missions</div>
          </Link>
          <Link to={"/"} className="w-28 h-14 flex bg-orange-200 rounded-lg">
            <div className="m-auto">Notifications</div>
          </Link>
          <Link to={"/"} className="w-28 h-14 flex bg-orange-200 rounded-lg">
            <div className="m-auto">Contrats</div>
          </Link>
          <Link to={"/"} className="w-28 h-14 flex bg-orange-200 rounded-lg">
            <div className="m-auto">Contact</div>
          </Link>
          <Link
            to={`/userUpdate/${userId}`}
            className="w-28 h-14 flex bg-orange-200 rounded-lg"
          >
            <div className="m-auto">Profil</div>
          </Link>
          <div className="absolute top-2 left-2">
            <SignedIn>
              <UserButton /> <br />
              <div className="w-fit p-2 bg-orange-300 rounded-md">
                <SignOutButton />
              </div>
            </SignedIn>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Menu;
