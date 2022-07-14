import type { User } from "@prisma/client";

const UserCard = (userInfo: User) => {
  return (
    <div
      className="userCard w-fit rounded-md flex flex-col p-2 mx-auto h-40"
      key={userInfo.id}
    >
      <div className="PhotoAFaire mx-auto w-12 h-12 bg-white rounded-full mb-5"></div>
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
