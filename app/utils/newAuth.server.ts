import { getAuth } from "@clerk/remix/ssr.server";
import { json, redirect } from "@remix-run/node";
import { prisma } from "./prisma.server";

type TypeData = {
  email: string;
  authId: string;
  birthday: string;
  birthplace: string;
  firstName: string;
  lastName: string;
};
export const getUser = async (request) => {
  const { userId } = await getAuth(request);
  if (!userId) return null;
  return userId;
};

export const userIsNew = async (authId: string) => {
  const userIsNew = await prisma.user.findUnique({
    where: { authId },
  });

  if (!userIsNew) {
    return true;
  }

  return false;
};

export const createNewUser = async (form: TypeData) => {
  const email = form.email.toString().toLowerCase().trim();
  const authId = form.authId.toString().trim();
  const firstName = form.firstName.toLowerCase().trim();
  const lastName = form.lastName.toLowerCase().trim();
  const birthplace = form.birthplace.toString().toLowerCase().trim();
  const birthday = form.birthday.toString().toLowerCase().trim();
  const validEmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (validEmailRegex.test(email) == false) {
    return json({ error: "Incorrect email format" });
  }
  const data = { email, authId, firstName, lastName, birthplace, birthday };
  const newUser = await prisma.user.create({
    data,
  });
  if (!newUser) console.log("error");
  console.log("success");

  return json({ message: "User successfully created" });
};
