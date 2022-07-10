import { getAuth } from "@clerk/remix/ssr.server";
import { json, redirect } from "@remix-run/node";
import { prisma, Role } from "./prisma.server";

type TypeData = {
  email: string;
  authId: string;
  birthday: string;
  birthplace: string;
  firstName: string;
  lastName: string;
  picture: string;
  personnalAdress: string;
  role: string;
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
        authId: true,
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
    //throw redirect("/first-connexion");
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
  const picture = form.picture.toString().toLowerCase().trim();
  const personnalAddress = form.personnalAdress.toString().toLowerCase().trim();
  const roleString = form.role;
  const validEmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (validEmailRegex.test(email) == false) {
    return json({ error: "Incorrect email format" });
  }
  if (!birthday || !birthplace) {
    console.log("not created");
    return;
  }
  let role;
  switch (roleString) {
    case "SALLE": {
      role = Role.SALLE;
      break;
    }
    case "CUISINE": {
      role = Role.CUISINE;
      break;
    }
    default: {
      return json({ error: "Role Switch Error" });
    }
  }
  const data = {
    email,
    authId,
    firstName,
    lastName,
    birthplace,
    birthday,
    picture,
    personnalAddress,
    role,
  };
  console.log(data);

  const newUser = await prisma.user.create({
    data,
  });

  return json({ newUser });
};
