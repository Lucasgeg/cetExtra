import { RegisterForm } from "./auth.server";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma.server";
import { json } from "@remix-run/node";

//////////////////////types////////////////////
type UpdateForm = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  birthday: string;
  birthCity: string;
  role: string;
  statut: number;
  workedTime: number;
};

export const createUser = async (user: RegisterForm) => {
  const passwordHash = await bcrypt.hash(user.password, 10);

  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      password: passwordHash,
      birthday: user.birthday,
      birthCity: user.birthCity,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
  return { id: newUser.id, email: newUser.email };
};

export const getUserList = async () => {
  return await prisma.user.findMany({
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
};
export const getUserInformation = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return json({ error: "User Not found" });
  const userInfo = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      birthCity: true,
      birthday: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      statut: true,
      workedTime: true,
      password: true,
    },
  });
  return userInfo;
};
export const deleteUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) {
    return json({ error: "User not found" });
  }
  return await prisma.user.delete({ where: { id } });
};

export const updateUser = async (id: string, form: UpdateForm) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    return json({ error: "User not found" });
  }
  return await prisma.user.upsert({
    where: { id },
    create: { ...form },
    update: { ...form },
  });
};
