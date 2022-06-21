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
export const getUserId = async (request) => {
  const { userId } = await getAuth(request);
  if (!userId) return null;
  return userId;
};
export const getCurrentUser = async (request) => {
  const authId = await getUserId(request);
  if (!authId) return null;
  try {
    const user = await prisma.user.findUnique({
      where: { authId },
      select: {
        id: true,
        email: true,
        birthplace: true,
        birthday: true,
        firstName: true,
        lastName: true,
        missionIDs: true,
        missions: true,
        pendingToken: true,
        role: true,
        statut: true,
        workedTime: true,
      },
    });
    return user;
  } catch (error) {
    throw redirect("/sign-in");
  }
};
export const userIsNew = async (request) => {
  const authId = (await getAuth(request)).userId;
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
  const firstName = form.firstName.trim();
  const lastName = form.lastName.trim();
  const birthplace = form.birthplace.toString().toLowerCase().trim();
  const birthday = form.birthday.toString().toLowerCase().trim();

  const validEmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (validEmailRegex.test(email) == false) {
    return json({ error: "Incorrect email format" });
  }
  if (!birthday || !birthplace) {
    console.log("not created");
    return;
  }
  const data = { email, authId, firstName, lastName, birthplace, birthday };
  const newUser = await prisma.user.create({
    data,
  });

  return json({ newUser });
};
