import type { Missions, User } from "@prisma/client";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";
type LoaderData = {
  userList: User[];
  futureMissions: Missions[];
};

const CetExtraInvitation = () => {
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedMission, setSelectedMission] = useState<Missions>(null);
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
          <div className="left w-4/6">
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
            <input type="hidden" name="missionId" value={selectedMission?.id} />
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

  const addOrRemoveOnArray = (email) => {
    const userIsOnArray = selectedUser.includes(email);
    if (!userIsOnArray) {
      setSelectedUser([...selectedUser, email]);
    } else {
      setSelectedUser(selectedUser.filter((userMail) => userMail !== email));
    }
  };
  return (
    <ul className="grid grid-cols-6 grid-rows-2 gap-2 h-96 m-auto overflow-auto bg-neutral-400">
      {userList.map((user) => {
        const selected = selectedUser.includes(user.email);
        return (
          <div
            className={"h-44 pt-2 " + (selected && " bg-white")}
            key={user.id}
          >
            <input
              type={"checkbox"}
              id={user.email}
              name="userMail"
              value={user.email}
              onChange={(event) => addOrRemoveOnArray(event.target.value)}
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
type MissionPropsType = {
  selectedMission: Missions;
  setSelectedMission: React.Dispatch<React.SetStateAction<Missions>>;
};
const MissionTable = ({
  selectedMission,
  setSelectedMission,
}: MissionPropsType) => {
  const { futureMissions } = useLoaderData<LoaderData>();
  return (
    <table className="w-full bg-white max-h-full overflow-auto">
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
              selectedMission?.id == mission.id && "bg-slate-400"
            }`}
            onClick={() => setSelectedMission(mission)}
          >
            {console.log(
              new Date(mission.beginAt).toISOString().split(".")[0] + "Z"
            )}
            <td className="h-6">{mission.missionName}</td>
            <td className="h-6">
              {format(new Date(mission.beginAt), "dd/MM/yyyy - HH:mm")}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
