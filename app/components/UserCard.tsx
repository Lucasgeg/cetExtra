import { Form, Link } from "@remix-run/react";

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
  const deleteSelectedUser = () => {
    const answer = prompt(
      "Merci de valider la suppression en écrivant le prénom de l'utilisateur à supprimer"
    );
    if (!answer || answer !== user.firstName) {
      alert("Erreur, pas suppression");
      return false;
    }
  };
  return (
    <div
      className="userCard w-full md:w-48 bg-orange-200 flex flex-col mx-auto p-2"
      key={user.id}
    >
      <div className="PhotoAFaire mx-auto w-20 h-20 bg-white rounded-full mb-5"></div>
      <div className="userInformation flex flex-col mx-auto text-center">
        <p>
          {user.firstName} {user.lastName}
        </p>
        <p>{user.role}</p>

        <div className="">
          <Link to={`/userUpdate/${user.id}`}>
            <button className="p-2 bg-red-400 border-2"> Modifier</button>
          </Link>
          <Form method="post">
            <input type="hidden" name="selectedUserId" value={user.id} />
            <input
              type="hidden"
              name="selectedUserFirstName"
              value={user.firstName}
            />
            <button
              type="submit"
              name="_action"
              value={"delete"}
              onClick={deleteSelectedUser}
              className="p-2 bg-red-400 border-2"
            >
              Supprimer
            </button>
          </Form>
        </div>
        <div className="">Proposer un extra</div>
      </div>
    </div>
  );
};

export default UserCard;
