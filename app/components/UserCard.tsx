import { Form, Link, useLoaderData } from "@remix-run/react";

type UserCardProps = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: number;
  statut: number;
  workedTime: number;
};

const UserCard = (userInfo: UserCardProps) => {
  const { userStatut } = useLoaderData();
  const deleteValidation = async (e: React.FormEvent<HTMLFormElement>) => {
    const answer = prompt(
      "Merci de valider la suppression en écrivant le prénom de l'utilisateur à supprimer"
    );
    if (!answer || answer !== userInfo.firstName) {
      alert("Erreur, pas suppression");
      e.preventDefault();
      return false;
    }
  };
  return (
    <div
      className="userCard w-full md:w-48  rounded-md flex flex-col mx-auto p-2"
      key={userInfo.id}
    >
      <div className="PhotoAFaire mx-auto w-20 h-20 bg-white rounded-full mb-5"></div>
      <div className="userInformation flex flex-col mx-auto text-center">
        <p>
          {userInfo.firstName} {userInfo.lastName}
        </p>
        <p>{userInfo.role}</p>

        <div className="">
          <Link to={`/userUpdate/${userInfo.id}`}>
            <button className="p-2 bg-red-400 border-2 rounded">
              {" "}
              Modifier
            </button>
          </Link>
          <Form
            method="post"
            onSubmit={(e) => {
              deleteValidation(e);
            }}
          >
            <input type="hidden" name="selectedUserId" value={userInfo.id} />
            <input
              type="hidden"
              name="selectedUserFirstName"
              value={userInfo.firstName}
            />
            {userStatut == "ADMIN" && (
              <button
                type="submit"
                name="_action"
                value={"delete"}
                className="p-2 bg-red-400 border-2 rounded mt-1"
              >
                Supprimer
              </button>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
