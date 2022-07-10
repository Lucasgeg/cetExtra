import {
  RedirectToSignIn,
  RedirectToSignUp,
  SignedIn,
  SignedOut,
  SignOutButton,
  useClerk,
  UserButton,
} from "@clerk/remix";
import type { Statut } from "@prisma/client";
import { LoaderFunction, redirect } from "@remix-run/node";
import { Link, useLoaderData, useParams } from "@remix-run/react";
import { userIsNew } from "~/utils/newAuth.server";
type LoaderData = {
  userStatut: Statut | null;
  userId: string;
  isNew: boolean;
};

const Menu = () => {
  const { userId, userStatut, isNew } = useLoaderData<LoaderData>();
  const { signOut } = useClerk();

  if (!userStatut) return null;
  return (
    <div className="pb-6">
      <SignedOut>
        <RedirectToSignUp />
      </SignedOut>
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
          <div className="relative top-2 left-2">
            <SignedIn>
              <div className="w-fit p-2 bg-orange-300 rounded-md">
                <button onClick={() => signOut()}>Déconnexion</button>
              </div>
            </SignedIn>
          </div>
        </nav>
      ) : (
        <nav className="admin_Menu flex items-center w-full justify-around">
          <SignedOut>
            <RedirectToSignUp />
          </SignedOut>
          <Link to={"/"} className="w-28 h-14 flex bg-orange-200 rounded-lg">
            <div className="m-auto">Accueil</div>
          </Link>
          <Link
            to={"/userroutes/missions"}
            className="w-28 h-14 flex bg-orange-200 rounded-lg"
          >
            <div className="m-auto">Mes Missions</div>
          </Link>
          <Link
            to={"/userroutes/notifications"}
            className="w-28 h-14 flex bg-orange-200 rounded-lg"
          >
            <div className="m-auto">Notifications</div>
          </Link>
          <Link to={"/"} className="w-28 h-14 flex bg-orange-200 rounded-lg">
            <div className="m-auto">Contrats</div>
          </Link>
          <Link
            to={"/userRoutes/contact"}
            className="w-28 h-14 flex bg-orange-200 rounded-lg"
          >
            <div className="m-auto">Contact</div>
          </Link>
          <Link
            to={`/userUpdate/${userId}`}
            className="w-28 h-14 flex bg-orange-200 rounded-lg"
          >
            <div className="m-auto">Profil</div>
          </Link>
          <SignedIn>
            <div className="w-fit p-2 bg-orange-300 rounded-md">
              <button
                onClick={() => {
                  signOut();
                }}
              >
                Déconnexion
              </button>
            </div>
          </SignedIn>
        </nav>
      )}
    </div>
  );
};

export default Menu;
