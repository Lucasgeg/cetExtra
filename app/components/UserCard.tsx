import { User } from "@prisma/client";
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

const UserCard = (userInfo: User) => {
  //SELECT SERVEUR // CUISINE
  return (
    <div
      className="userCard w-fit rounded-md flex flex-col p-2 mx-auto"
      key={userInfo.id}
    >
      <div className="PhotoAFaire mx-auto w-20 h-20 bg-white rounded-full mb-5"></div>
      <div className="userInformation flex flex-col mx-auto text-center">
        <p>
          {userInfo.firstName} {userInfo.lastName}
        </p>
        <p>{userInfo.role}</p>
      </div>
    </div>
  );
};

export default UserCard;
