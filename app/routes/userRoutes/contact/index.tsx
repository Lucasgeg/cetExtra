import type { User } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { getCurrentUser } from "~/utils/newAuth.server";
import { contactMail } from "~/utils/userMissions.server";
import logo from "~/assets/cetExtraIcon.png";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getCurrentUser(request);
  return json({ user });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const userName = form.get("userName").toString();
  const userMail = form.get("userMail").toString();
  const userMessage = form.get("userMessage").toString();

  if (!userName || !userMail || !userMessage)
    return json({ error: "Merci de remplir tous les champs" });
  const send = contactMail(userMail, userName, userMessage);

  return json({ send });
};

const index = () => {
  return (
    <div className="">
      <ContactForm />
    </div>
  );
};

export default index;
type LoaderData = {
  user: User;
};
const ContactForm = () => {
  const actionData = useActionData();
  const { user } = useLoaderData<LoaderData>();
  const transition = useTransition();
  const isSending =
    transition.state === "submitting" &&
    transition.submission.formData.get("_action") === "sendMail";
  const [showModal, setShowModal] = useState(false);
  const formRef = useRef();
  useEffect(() => {
    if (!isSending && formRef?.current) {
      actionData?.send && setShowModal(!showModal);
      return formRef?.current?.reset();
    }
  }, [isSending, actionData]);

  return (
    <Form
      method="post"
      className="w-full flex items-center justify-center my-12"
      ref={formRef}
    >
      {showModal && <Modal showModal={showModal} setShowModal={setShowModal} />}
      <div className="top-20 bg-white dark:bg-gray-800 shadow rounded py-12 lg:px-28 px-8">
        <p className="md:text-3xl text-xl font-bold leading-7 text-center text-gray-700 dark:text-white">
          Besoin de nous contacter?
        </p>
        <div className="md:flex items-center mt-12">
          <div className="md:w-72 flex flex-col">
            <label className="text-base font-semibold leading-none text-gray-800 dark:text-white">
              Nom
            </label>
            <input
              tabIndex={0}
              arial-label="Please input name"
              type="name"
              name="userName"
              defaultValue={user.lastName + " " + user.firstName}
              className="text-base leading-none text-gray-900 p-3 focus:oultine-none focus:border-indigo-700 mt-4 bg-gray-100 border rounded border-gray-200 placeholder-gray-100"
              placeholder="Please input  name"
            />
          </div>
          <div className="md:w-72 flex flex-col md:ml-6 md:mt-0 mt-4">
            <label className="text-base font-semibold leading-none text-gray-800 dark:text-white">
              Votre Mail
            </label>
            <input
              defaultValue={user.email}
              tabIndex={0}
              arial-label="Please input email address"
              type="name"
              name="userMail"
              className="w-52 text-base leading-none text-gray-900 p-3 focus:oultine-none focus:border-indigo-700 mt-4 bg-gray-100 border rounded border-gray-200 placeholder-gray-100"
              placeholder="Please input email address"
            />
          </div>
        </div>
        <div>
          <div className="w-full flex flex-col mt-8">
            <label className="text-base font-semibold leading-none text-gray-800 dark:text-white">
              Message
            </label>
            <textarea
              tabIndex={0}
              aria-label="leave a message"
              name="userMessage"
              className="h-36 text-base leading-none text-gray-900 p-3 focus:oultine-none focus:border-indigo-700 mt-4 bg-gray-100 border rounded border-gray-200 placeholder-gray-100 resize-none"
            ></textarea>
          </div>
        </div>
        <p className="text-xs leading-3 text-gray-600 dark:text-gray-200 mt-4">
          By clicking submit you agree to our terms of service, privacy policy
          and how we use data as stated
        </p>
        <div className="flex items-center justify-center w-full">
          <button
            type={"submit"}
            disabled={isSending}
            name={"_action"}
            value={"sendMail"}
            className={`mt-9 text-base font-semibold leading-none text-white py-4 px-10  ${
              isSending ? "bg-gray-500" : "bg-indigo-700"
            }  rounded hover:bg-indigo-600 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 focus:outline-none`}
          >
            {isSending ? "Envois..." : "Envoyer"}
          </button>
        </div>
      </div>
    </Form>
  );
};

const Modal = ({ showModal, setShowModal }) => {
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
                  Le message est bien parti!
                </h1>
                <p className="mb-5 text-sm text-gray-600 dark:text-gray-400 text-center font-normal">
                  Merci de votre attention et de votre doux message! <br />
                  Nous ne manquerons pas de vous répondre dès que possible!{" "}
                  <br />
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
                    J'ai un autre mot doux!
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
