import { Missions } from "@prisma/client";
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
    user: "",
    mission: "",
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
      <label htmlFor="user">Utilisateur</label>
      <br />
      <select
        name="user"
        id="user"
        value={formData.user}
        onChange={(e) => handleInputChange(e, "user")}
      >
        {userList.map((user) => (
          <option value={user.email} key={user.email}>
            {user.lastName} {user.firstName}
          </option>
        ))}
      </select>{" "}
      <br />
      <label htmlFor="mission">Mission</label>
      <br />
      <select
        name="mission"
        value={formData.mission}
        onChange={(e) => handleInputChange(e, "mission")}
      >
        {missions.map((mission) => (
          <option value={mission.id} key={mission.id}>
            {mission.missionName}
          </option>
        ))}
      </select>
      <br />
      <button type="submit" name="_action" value={"invite"}>
        proposer extra
      </button>
    </Form>
  );
};

export default ExtraInvitForm;
