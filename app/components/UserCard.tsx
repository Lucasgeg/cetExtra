import { Link } from "@remix-run/react";

type UserCardProps = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: number;
  statut: number;
  workedTime: number;
};

const UserCard = (user: UserCardProps) => {
  return (
    <div
      className="userCard w-full md:w-44 bg-orange-200 flex flex-col mx-auto p-5"
      key={user.id}
    >
      <div className="PhotoAFaire mx-auto w-20 h-20 bg-white rounded-full mb-5"></div>
      <div className="userInformation flex flex-col mx-auto text-center">
        <p>
          {user.firstName} {user.lastName}
        </p>
        <p>{user.role}</p>

        <div className="">
          <Link to={`/userUpdate/${user.id}`}>Toto</Link>
          <button>Modifier</button> <button>Supprimer</button>
        </div>
        <div className="">Proposer un extra</div>
      </div>
    </div>
  );
};

export default UserCard;
