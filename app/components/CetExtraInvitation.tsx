import type { Missions, User } from "@prisma/client";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import { useState } from "react";
import UserCard from "./UserCard";
type LoaderData = {
  userList: User[];
  futureMissions: Missions[];
};

const CetExtraInvitation = () => {
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedMission, setSelectedMission] = useState("");
  const actionData = useActionData();
  return (
    <>
      {actionData?.errors && (
        <p className="text-center">
          Sélectionner au moins un user et une mission
        </p>
      )}
      <Form method="post" className="">
        <div className="w-11/12 mx-auto flex">
          <div className="left w-5/6">
            <Users
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            />
          </div>
          <div className="right w-1/6">
            <MissionTable
              selectedMission={selectedMission}
              setSelectedMission={setSelectedMission}
            />
            <input type="hidden" name="missionId" value={selectedMission} />
          </div>
        </div>
        <div className="w-full text-center">
          <button
            type="submit"
            className="inline-block px-6 py-2 border-2 border-gray-800 text-white font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out mt-4"
          >
            Inviter
          </button>
        </div>
      </Form>
    </>
  );
};

export default CetExtraInvitation;

type userPropsType = {
  selectedUser: string[];
  setSelectedUser: React.Dispatch<React.SetStateAction<string[]>>;
};

const Users = ({ selectedUser, setSelectedUser }: userPropsType) => {
  const { userList } = useLoaderData<LoaderData>();

  const addToArray = (email) => {
    const userIsOnArray = selectedUser.includes(email);
    if (!userIsOnArray) {
      setSelectedUser([...selectedUser, email]);
    }
  };
  return (
    <ul className="grid grid-cols-9 p-2 h-96 overflow-auto bg-neutral-400">
      {userList.map((user) => {
        return (
          <div className="" key={user.id}>
            <input
              type={"checkbox"}
              id={user.email}
              name="userMail"
              value={user.email}
              onChange={(event) => addToArray(event.target.value)}
              hidden={true}
            />
            <label htmlFor={user.email}>
              <UserCard {...user} />
            </label>
          </div>
        );
      })}
    </ul>
  );
};

const MissionTable = ({ selectedMission, setSelectedMission }) => {
  const { futureMissions } = useLoaderData<LoaderData>();
  return (
    <table className="w-full bg-white">
      <thead>
        <tr>
          <th>Mission</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody className="text-center p-2">
        {futureMissions.map((mission) => (
          <tr
            key={mission.id}
            className={`text-sm cursor-pointer ${
              selectedMission == mission.id && "bg-slate-400"
            }`}
            onClick={() => setSelectedMission(mission.id)}
          >
            <td>{mission.missionName}</td>
            <td>{format(new Date(mission.beginAt), "dd/MM/yyyy - HH:mm")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
