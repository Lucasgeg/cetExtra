import type { Missions } from "@prisma/client";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";

type Users = {
  lastName: string;
  firstName: string;
  email: string;
};

type LoaderData = {
  userList: Users[];
  missions: Missions[];
};
const ExtraInvitForm = () => {
  const { missions, userList } = useLoaderData<LoaderData>();
  const [formData, setFormData] = useState({
    userMail: "",
    missionId: "",
  });
  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };

  return (
    <Form method="post">
      <label htmlFor="userMail">Utilisateur</label>
      <br />
      <select
        name="userMail"
        id="user"
        value={formData.userMail}
        onChange={(e) => handleInputChange(e, "userMail")}
      >
        {userList.map((user) => (
          <option value={user.email} key={user.email}>
            {user.lastName} {user.firstName}
          </option>
        ))}
      </select>
      <br />
      <label htmlFor="missionId">Mission</label>
      <br />
      <select
        name="missionId"
        value={formData.missionId}
        onChange={(e) => handleInputChange(e, "missionId")}
      >
        {missions.map((mission) => (
          <option value={mission.id} key={mission.id}>
            {mission.missionName}
          </option>
        ))}
      </select>
      <br />
      <button
        type="submit"
        name="_action"
        value={"invite"}
        className="p-3 bg-slate-400 rounded-lg hover:bg-orange-200 my-1"
      >
        Inviter cet Extra!
      </button>
    </Form>
  );
};

export default ExtraInvitForm;
