import type { Missions, User } from "@prisma/client";
import { Form, useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import { useState } from "react";
import UserCard from "./UserCard";
type LoaderData = {
  userList: User[];
  pendingMissions: Missions[];
};

const CetExtraInvitation = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedMission, setSelectedMission] = useState("");
  return (
    <Form method="post" className="w-11/12 mx-auto flex">
      <div className="left w-5/6 bg-green-500">
        <Users selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
      </div>
      <div className="right w-1/6 bg-white">
        <MissionTable
          selectedMission={selectedMission}
          setSelectedMission={setSelectedMission}
        />
        <input type="hidden" name="userMail" value={selectedUser} />
        <input type="hidden" name="missionId" value={selectedMission} />
      </div>
      <button type="submit">Inviter</button>
    </Form>
  );
};

export default CetExtraInvitation;

const Users = ({ selectedUser, setSelectedUser }) => {
  const { userList } = useLoaderData<LoaderData>();

  return (
    <ul className="grid grid-cols-9 p-2">
      {userList.map((user) => (
        <li
          key={user.email}
          className={selectedUser == user.email ? "border-2" : null}
          onClick={() => setSelectedUser(user.email)}
        >
          <UserCard {...user} />
        </li>
      ))}
    </ul>
  );
};

const MissionTable = ({ selectedMission, setSelectedMission }) => {
  const { pendingMissions } = useLoaderData<LoaderData>();
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>Mission</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody className="text-center p-2">
        {pendingMissions.map((mission) => (
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
