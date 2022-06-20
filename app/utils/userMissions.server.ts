import { json } from "@remix-run/node";
import { Missions, prisma } from "./prisma.server";
import crypto from "crypto";
import { getMissionInformation } from "./missions.server";
import sgMail from "@sendgrid/mail";

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
  missionDate: Date
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
export const sendPendingUserToMission = async (user, mission) => {
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
  const missionDate = missionInfos.beginAt;

  //send mail to user
  sendMail(user, userFirstName, token, missionName, missionPlace, missionDate);
  return json({ message: "Invitation sended" });
};
export const getMissionByToken = async (token) => {
  const mission = await prisma.pendingUserToMission.findUnique({
    where: { token },
  });
  if (!mission) return json({ message: "Mission not found" });
  const missionId = mission.missionId;
  return await getMissionInformation(missionId);
};
export const validateMissionToken = async (userMail, token) => {
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
  const pendingUserToMission = await prisma.pendingUserToMission.findFirst({
    where: { userMail, AND: { token } },
  });
  await connectToMission(
    pendingUserToMission.userMail,
    pendingUserToMission.missionId
  );
  await prisma.user.update({
    where: { email: userMail },
    data: { pendingToken: userPendingTokenArrayPullUsedToken },
  });
  await prisma.pendingUserToMission.delete({
    where: { token },
  });
  console.log("User is now connected");

  return json({ message: "User is now connected" });
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
