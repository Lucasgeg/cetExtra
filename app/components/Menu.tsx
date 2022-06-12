import type { Statut } from "@prisma/client";
import { Link } from "@remix-run/react";
type User = {
  statut: Statut;
  id: string;
};
const Menu = (user: User) => {
  return (
    <>
      {user.statut !== "USER" ? (
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
        </nav>
      ) : (
        <nav className="admin_Menu flex items-center w-full justify-around">
          <Link to={"/"} className="w-28 h-14 flex bg-orange-200 rounded-lg">
            <div className="m-auto">Accueil</div>
          </Link>
          <Link to={"/"} className="w-28 h-14 flex bg-orange-200 rounded-lg">
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
            to={`/userUpdate/${user.id}`}
            className="w-28 h-14 flex bg-orange-200 rounded-lg"
          >
            <div className="m-auto">Profil</div>
          </Link>
        </nav>
      )}
    </>
  );
};

export default Menu;
