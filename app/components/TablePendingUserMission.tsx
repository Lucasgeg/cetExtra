import { PendingUserToMission } from "@prisma/client";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import { useState } from "react";

type LoaderData = {
  pendingUserToMission: PendingUserToMission[];
};

const TablePendingUserMission = () => {
  const { pendingUserToMission } = useLoaderData<LoaderData>();
  const [selectNotification, setSelectNotification] = useState([]);
  const addOrRemoveOnArray = (email) => {
    const userIsOnArray = selectNotification.includes(email);
    if (!userIsOnArray) {
      setSelectNotification([...selectNotification, email]);
    } else {
      setSelectNotification(
        selectNotification.filter((userMail) => userMail !== email)
      );
    }
  };
  return (
    <div>
      <div className="relative flex flex-col w-3/4 mx-auto min-w-0 mb-0 break-words bg-white border-0 border-transparent border-solid shadow-soft-xl rounded-xl bg-clip-border max-[70vh]">
        <div className="p-6 pb-0 mb-0 bg-white rounded-t-2xl">
          <h6>Utilisateur en attente</h6>
        </div>
        <div className="flex-auto px-0 pt-0 pb-2">
          <div className="p-0 overflow-x-auto">
            <table className="items-center w-full mb-0 align-top border-gray-200 text-slate-500">
              <thead className="align-bottom">
                <tr>
                  <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-size-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                    Email extra
                  </th>
                  <th className="px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-size-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                    Date de la presta
                  </th>
                  <th className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-size-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {pendingUserToMission.map((user, key) => {
                  const isPassed = new Date(user.beginAt) < new Date();

                  return (
                    <tr
                      key={key}
                      className={isPassed ? "bg-red-500 text-white" : null}
                    >
                      <td className="p-2 align-middle bg-transparent whitespace-nowrap shadow-transparent">
                        <div className="flex px-2 py-1">
                          <div className="flex flex-col justify-center">
                            <h6 className="mb-0 leading-normal text-size-sm">
                              {user.userMail}
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="p-2 align-middle bg-transparent whitespace-nowrap shadow-transparent">
                        <p className="mb-0 font-semibold leading-tight text-size-xs">
                          {user.missionName}
                        </p>
                        <p className="mb-0 leading-tight text-size-xs text-slate-400">
                          {format(new Date(user.beginAt), "dd/MM/yy hh:mm")}
                        </p>
                      </td>
                      <td className="p-2 align-middle bg-transparent whitespace-nowrap shadow-transparent">
                        <div className="flex justify-end">
                          {/* delete userpending token && delete pendingmissionlist ==> checkbox deletemany */}
                          <input
                            type={"checkbox"}
                            name={"userMail"}
                            value={user.token}
                            onClick={() => addOrRemoveOnArray(user.token)}
                          />
                          Suppression
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Form method="post">
        <input
          type="hidden"
          name="notificationToDelete"
          value={selectNotification}
        />
        <button
          type="submit"
          className=" mr-3 inline-block px-6 py-3 font-bold text-center bg-gradient-fuchsia uppercase align-middle transition-all rounded-lg cursor-pointer leading-pro text-size-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs text-white"
        >
          Button
        </button>
      </Form>
    </div>
  );
};

export default TablePendingUserMission;
