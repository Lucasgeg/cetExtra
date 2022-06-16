import { LoaderFunction } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import React, { useState } from "react";
import MapComponent from "./MapComponent";

const CreateMissionForm = () => {
  const actionData = useActionData();
  const [formData, setFormData] = useState({
    missionName: "",
    place: "",
    lat: null,
    lng: null,
    beginAt: "",
    endAt: "",
  });
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };
  const { userId } = useLoaderData();
  return (
    <>
      {actionData?.errorCreation ? (
        <>
          <p>{actionData?.errorCreation}</p>
        </>
      ) : null}
      <Form method="post">
        <input type="hidden" name="creatorId" value={userId} />
        <label htmlFor="beginAt">date début:</label>
        <input
          type="datetime-local"
          name="beginAt"
          value={formData.beginAt}
          onChange={(e) => handleInputChange(e, "beginAt")}
          required
        />
        <br />
        {actionData?.errorTime ? (
          <>
            <p>{actionData?.errorTime}</p>
          </>
        ) : null}
        <label htmlFor="endAt">Date fin:</label>
        <input
          type="datetime-local"
          name="endAt"
          value={formData.endAt}
          onChange={(e) => handleInputChange(e, "endAt")}
          required
        />
        <br />
        {actionData?.errorTime ? (
          <>
            <p>{actionData?.errorTime}</p>
          </>
        ) : null}
        <label htmlFor="missionName">Nom de la mission:</label>
        <input
          type="text"
          name="missionName"
          value={formData.missionName}
          onChange={(e) => handleInputChange(e, "missionName")}
        />
        <br />
        {actionData?.errorName ? (
          <>
            <p>{actionData?.errorName}</p>
          </>
        ) : null}
        <MapComponent
          search={true}
          formData={formData}
          setFormData={setFormData}
        />

        <input type="hidden" value={formData.place} name="place" />
        <input type="hidden" value={formData.lat} name="lat" />
        <input type="hidden" value={formData.lng} name="lng" />
        <button
          type="submit"
          name="_action"
          value={"create"}
          className="p-3 bg-slate-400 rounded-lg mt-3"
        >
          créer
        </button>
      </Form>
    </>
  );
};

export default CreateMissionForm;
