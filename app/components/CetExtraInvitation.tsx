import type { Missions, User } from "@prisma/client";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import UserCard from "./UserCard";
import logo from "~/assets/cetExtraIcon.png";
type LoaderData = {
  userList: User[];
  futureMissions: Missions[];
};

const CetExtraInvitation = () => {
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedMission, setSelectedMission] = useState<Missions>();
  const [showModal, setShowModal] = useState(false);
  const actionData = useActionData();

  const sendStatut = useTransition();
  const sending =
    sendStatut.state === "submitting" &&
    sendStatut.submission.formData.get("_action") === "sendInvitation";
  const formRef = useRef();
  useEffect(() => {
    if (!sending && formRef?.current) {
      actionData?.showModal && setShowModal(!showModal);
      setSelectedUser([]);
      setSelectedMission(null);
    }
  }, [sending]);
  return (
    <>
      {actionData?.errors && (
        <p className="text-center text-white">{actionData.errors}</p>
      )}

      {showModal && (
        <>
          <Modal
            showModal={showModal}
            setShowModal={setShowModal}
            selectedUsers={selectedUser}
          />
        </>
      )}
      <Form method="post" ref={formRef}>
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
            disabled={sending}
            type="submit"
            name={"_action"}
            value={"sendInvitation"}
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
  const actionData = useActionData();
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
              checked={selected}
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
            {/* {console.log(
              new Date(mission.beginAt).toISOString().split(".")[0] + "Z"
            )} */}
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
type ModalProps = {
  showModal: boolean;
  setShowModal: any;
  selectedUsers: string[];
};
const Modal = ({ showModal, setShowModal, selectedUsers }: ModalProps) => {
  const actionData = useActionData();
  const userMails: string[] = actionData?.userMails;
  return (
    <div>
      <div>
        {showModal && (
          <div
            className="py-12 bg-gray-700 dark:bg-gray-900 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0"
            id="modal"
          >
            <div
              role="alert"
              className="container mx-auto w-11/12 md:w-2/3 max-w-lg"
            >
              <div className="relative py-8 px-8 md:px-16 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-md rounded border border-gray-400">
                <div className="w-full flex justify-center text-green-400 mb-4">
                  <img src={logo} alt="logo cetExtra !" />
                </div>
                <h1 className="text-center text-gray-800 dark:text-gray-100 font-lg font-bold tracking-normal leading-tight mb-4">
                  Invitation envoyée!
                </h1>
                <p className="mb-5 text-sm text-gray-600 dark:text-gray-400 text-center font-normal">
                  Les invitations à la mission: <br />
                  ont bien été envoyées aux adresse mail: <br />
                  {userMails && userMails.join(" / ")} <br />
                  <span className="underline italic">
                    L'équipe de cetExtra!
                  </span>
                </p>
                <div className="flex items-center justify-center w-full">
                  <button className="focus:outline-none transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-4 sm:px-8 py-2 text-xs sm:text-sm">
                    <Link to={"/"}>Accueil</Link>
                  </button>
                  <button
                    className="focus:outline-none ml-3 bg-gray-100 dark:bg-gray-700 dark:border-gray-700 dark:hover:bg-gray-600 transition duration-150 text-gray-600 dark:text-gray-400 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm"
                    onClick={() => setShowModal(!showModal)}
                  >
                    Inviter d'autres Extra
                  </button>
                </div>
                <div
                  className="cursor-pointer absolute top-0 right-0 mt-4 mr-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-500 transition duration-150 ease-in-out"
                  onClick={() => setShowModal(!showModal)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Close"
                    className="icon icon-tabler icon-tabler-x"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <line x1={18} y1={6} x2={6} y2={18} />
                    <line x1={6} y1={6} x2={18} y2={18} />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
