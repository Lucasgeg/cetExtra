import { json } from "@remix-run/node";
import { prisma } from "./prisma.server";
import crypto from "crypto";

type pendingUserToMission = {
  usermail: string;
  missionId: string;
};

export const sendPendingUserToMission = async (user, mission) => {
  //verif si mission déjà proposé

  const token = crypto.randomBytes(16).toString("hex");
  await prisma.user.update({
    where: { email: user },
    data: { pendingToken: { push: token } },
  });

  await prisma.pendingUserToMission.create({
    data: { userMail: user, missionId: mission, token },
  });
  return json({ message: "Invitation sended" });
};
export const validateMissionToken = async (userMail, token) => {
  const haveTheToken = await prisma.user.findMany({
    where: { email: userMail, AND: { pendingToken: { has: token } } },
    select: { pendingToken: true },
  });

  if (!haveTheToken.length) return console.log("not found");
  console.log("token founded");
  const pendingUserToMission = await prisma.pendingUserToMission.findFirst({
    where: { userMail, AND: { token } },
  });
  await connectToMission(
    pendingUserToMission.userMail,
    pendingUserToMission.missionId
  );
  console.log("user is now connected to mission");
  return true;
};
export const connectToMission = async (user, mission) => {
  const userToConnect = await prisma.user.findUnique({
    where: { email: user },
  });
  const missionToConnect = await prisma.missions.findUnique({
    where: { id: mission },
  });

  if (!userToConnect || !missionToConnect)
    return json({ error: "Selected items are not valid" });

  const connect = await prisma.user.update({
    where: { email: user },
    data: { missions: { connect: { id: mission } } },
  });
  if (!connect)
    return json({ error: "Server unable to connect to the mission" });
  return json({ message: "User connected to the mission" });
};

export const disconnectToMission = async (user, mission) => {
  const userToConnect = await prisma.user.findUnique({
    where: { email: user },
  });
  const missionToConnect = await prisma.missions.findUnique({
    where: { id: mission },
  });

  if (!userToConnect || !missionToConnect)
    return json({ error: "Selected items are not valid" });

  const disconnect = await prisma.user.update({
    where: { email: user },
    data: { missions: { disconnect: { id: mission } } },
  });

  if (!disconnect)
    return json({ error: "Something went wrong on disconnection" });
  return json({ message: "User disconnected from the mission" });
};