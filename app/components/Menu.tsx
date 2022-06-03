import { Link } from "@remix-run/react";
type User = {
  statut: string;
};
const Menu = (user: User) => {
  console.log(user);

  return (
    <>
      {user.statut == "ADMIN" ? (
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
      ) : null}
    </>
  );
};

export default Menu;
