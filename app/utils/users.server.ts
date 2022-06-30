import type { RegisterForm } from "./auth.server";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma.server";
import { json, redirect } from "@remix-run/node";
import type { Role, Statut } from "@prisma/client";

//////////////////////types////////////////////
type UpdateForm = {
  email?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  password?: string | undefined;
  validatePassword?: string | undefined;
  birthday?: string | undefined;
  birthCity?: string | undefined;
  role?: Role | undefined;
  statut?: Statut | undefined;
};

export const getUserList = async () => {
  const userList = await prisma.user.findMany({
    select: {
      email: true,
      firstName: true,
      id: true,
      lastName: true,
      role: true,
      statut: true,
      workedTime: true,
    },
  });
  const serverList = await prisma.user.findMany({
    where: { role: "SALLE" },
    select: {
      email: true,
      firstName: true,
      id: true,
      lastName: true,
      role: true,
      statut: true,
      workedTime: true,
    },
  });
  const kitchenList = await prisma.user.findMany({
    where: { role: "CUISINE" },
    select: {
      email: true,
      firstName: true,
      id: true,
      lastName: true,
      role: true,
      statut: true,
      workedTime: true,
    },
  });
  return { userList, serverList, kitchenList };
};
export const getUserInformation = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id: id } });
  if (!user) return json({ error: "User Not found" });

  try {
    const userInfo = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        birthplace: true,
        birthday: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        statut: true,
        workedTime: true,
      },
    });
    return userInfo;
  } catch (error) {
    return error;
  }
};
export const getUserPerMail = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return json({ error: "User Not found" });

  try {
    const userInfo = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        birthplace: true,
        birthday: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        statut: true,
        workedTime: true,
      },
    });
    return userInfo;
  } catch (error) {
    return error;
  }
};
export const deleteUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) {
    return json({ error: "User not found" });
  }
  await prisma.user.delete({ where: { id } });
  throw redirect("/adminroutes/userlist");
};

export const updateUser = async (id: string, form: UpdateForm) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    return json({ error: "User not found" });
  }
  let hashedPassword;
  if (form.password) {
    const validPasswordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!form.password.length || !validPasswordRegex.test(form.password)) {
      return json({
        error:
          "Password must be at least 8 character, one letter, one special character",
      });
    }
    if (form.password !== form.validatePassword) {
      return json({ error: "Passwords doesn't matches" });
    }
    if (typeof form.password !== "string")
      return json({ error: "password is not correct" });
    else {
      hashedPassword = await bcrypt.hash(form.password, 10);
    }
  }

  await prisma.user.update({
    where: { id },
    data: {
      birthplace: form.birthCity || undefined,
      birthday: form.birthday || undefined,
      email: form.email || undefined,
      firstName: form.firstName || undefined,
      lastName: form.lastName || undefined,
      role: form.role || undefined,
      statut: form.statut || undefined,
    },
  });
  console.log("toto a réussi!");

  return json({ message: "Toto est au bout", validate: true, modify: false });
};

export const userMissions = async (id: string) => {
  const today = new Date();

  const futureMisions = await prisma.missions.findMany({
    where: { userIDs: { has: id }, AND: { beginAt: { gte: today } } },
    orderBy: { beginAt: "asc" },
  });
  const pastMissions = await prisma.missions.findMany({
    where: { userIDs: { has: id }, AND: { beginAt: { lte: today } } },
    orderBy: { beginAt: "asc" },
  });
  return { futureMisions, pastMissions };
};

export const getUserNextMission = async (id: string) => {
  const today = new Date();
  const nextMission = await prisma.user.findUnique({
    where: { id },
    include: { missions: { where: { beginAt: { gte: today } } } },
  });
  return nextMission;
};
