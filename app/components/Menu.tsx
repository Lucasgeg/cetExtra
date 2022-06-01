import { Link } from "@remix-run/react";
type User = {
  statut: number;
};
const Menu = (user: User) => {
  return (
    <>
      {user.statut == 1 ? (
        <nav className="admin_Menu">
          <Link to={"/adminroutes/userList"}>
            <button>User List</button>
          </Link>
        </nav>
      ) : null}
    </>
  );
};

export default Menu;
