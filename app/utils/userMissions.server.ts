import { json, redirect } from "@remix-run/node";
import { Missions, prisma } from "./prisma.server";
import crypto from "crypto";
import { getMissionInformation } from "./missions.server";
import sgMail from "@sendgrid/mail";
import { format } from "date-fns";

type pendingUserToMission = {
  usermail: string;
  missionId: string;
};

type MissionMailData = {
  missionName: string;
  missionPlace: string;
  missionDate: Date;
};

type MailData = {
  email: string;
  token: string;
  missionInformation: MissionMailData;
};

const sendMail = (
  email: string,
  userFirstName: string,
  token: string,
  missionName: string,
  missionPlace: string,
  missionDate: string
) => {
  if (!email || !token) {
    return json({ message: "INVALID_PARAMETER" });
  }
  sgMail.setApiKey(process.env.KEY_SENDGRID);

  const sendGridMail = {
    to: email,
    from: "contact@lvp-web.fr",
    templateId: "d-cad383b83a1a482690bf97c103aefc28",
    dynamic_template_data: {
      email,
      userFirstName,
      token,
      missionName,
      missionDate,
      missionPlace,
    },
  };
  //envois du mail
  (async () => {
    try {
      await sgMail.send(sendGridMail); // choisir quel const utiliser pour l'envois de mail
      console.log("invitation envoyée");

      return json({
        message: "EMAIL_SENDED_SUCCESSFULLY",
      });
    } catch {
      console.log("invitation non envoyée");

      return json({
        message: "ERROR_WITH_SENDGRID",
      });
    }
  })();
};
export const sendPendingUserToMission = async (
  user: string,
  mission: string
) => {
  const token = crypto.randomBytes(16).toString("hex");
  //verif si mission déjà proposé
  if (typeof user !== "string") return;
  const allreadyIn = await prisma.pendingUserToMission.findFirst({
    where: { userMail: user, AND: { missionId: mission } },
  });
  if (allreadyIn)
    return json({ error: "User is allready on the pending List" });

  await prisma.user.update({
    where: { email: user },
    data: { pendingToken: { push: token } },
  });

  await prisma.pendingUserToMission.create({
    data: { userMail: user, missionId: mission, token },
  });
  const userFirstName = (
    await prisma.user.findUnique({ where: { email: user } })
  ).firstName;
  const missionInfos = await prisma.missions.findUnique({
    where: { id: mission },
  });
  const missionName = missionInfos.missionName;
  const missionPlace = missionInfos.place;
  const missionDate = format(
    new Date(missionInfos.beginAt),
    "dd/MM/yyyy à HH:mm"
  );

  //send mail to user
  sendMail(user, userFirstName, token, missionName, missionPlace, missionDate);
  return json({ message: "Invitation sended" });
};
export const getMissionByToken = async (token: string) => {
  const pendingMission = await prisma.pendingUserToMission.findUnique({
    where: { token },
  });
  if (!pendingMission) return false;
  const missionId = pendingMission.missionId;
  const mission = await prisma.missions.findUnique({
    where: { id: missionId },
    select: { missionName: true, place: true, beginAt: true, id: true },
  });
  return mission;
};
export const validateMissionToken = async (userMail: string, token: string) => {
  //est ce que l'user avec le mail Usermail à le token?
  const haveTheToken = await prisma.user.findMany({
    where: { email: userMail, AND: { pendingToken: { has: token } } },
    select: { pendingToken: true },
  });
  if (!haveTheToken.length) return json({ message: "not found", status: 404 });
  console.log("token founded");

  const userTokenRes = await prisma.user.findUnique({
    where: { email: userMail },
    select: { pendingToken: true },
  });
  const userPendingTokenArrayPullUsedToken =
    userTokenRes.pendingToken &&
    userTokenRes.pendingToken.filter((tokens) => tokens !== token);

  const pendingUserToMission = await prisma.pendingUserToMission.findFirst({
    where: { userMail, AND: { token } },
  });
  await connectToMission(
    pendingUserToMission.userMail,
    pendingUserToMission.missionId
  );
  await prisma.user.update({
    where: { email: userMail },
    data: { pendingToken: { set: userPendingTokenArrayPullUsedToken } },
  });
  await prisma.pendingUserToMission.delete({
    where: { token },
  });
  console.log("User is now connected");

  //redirect validatePage avec mission
  return "toto";
};
const validateRedirect = async (mission) => {};
export const refuseMissionToken = async (userMail: string, token: string) => {
  const haveTheToken = await prisma.user.findMany({
    where: { email: userMail, AND: { pendingToken: { has: token } } },
    select: { pendingToken: true },
  });
  const userTokenRes = await prisma.user.findUnique({
    where: { email: userMail },
    select: { pendingToken: true },
  });
  const userPendingTokenArrayPullUsedToken =
    userTokenRes.pendingToken &&
    userTokenRes.pendingToken.filter((tokens) => tokens !== token);

  if (!haveTheToken.length) return json({ message: "not found", status: 404 });
  console.log("token founded");
  await prisma.user.update({
    where: { email: userMail },
    data: { pendingToken: userPendingTokenArrayPullUsedToken },
  });
  await prisma.pendingUserToMission.delete({
    where: { token },
  });
  console.log("User not connected and deleted from pendingList");

  return json({ message: "User not connected and deleted from pendingList" });
};
export const connectToMission = async (user: string, mission: string) => {
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

export const disconnectToMission = async (user: string, mission: string) => {
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
