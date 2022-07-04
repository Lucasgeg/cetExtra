import { json } from "@remix-run/node";
import { prisma } from "./prisma.server";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";
import { format } from "date-fns";

export const contactMail = (
  userMail: string,
  userName: string,
  userMessage: string
) => {
  sgMail.setApiKey(process.env.KEY_SENDGRID);

  const sendGridMail = {
    to: "contact@lvp-web.fr",
    from: "contact@lvp-web.fr",
    templateId: "d-632df0df23294d78a85b2694f90bd500",
    dynamic_template_data: {
      userMail,
      userName,
      userMessage,
    },
  };
  try {
    sgMail.send(sendGridMail);
    console.log("Message envoyé");
    return true;
  } catch (error) {
    console.log("Message non envoyé");
    console.log(error.response.body.errors);

    return json({
      message: "ERROR_WITH_SENDGRID",
    });
  }
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
    to: email, // multiple recipient, ["email1","email2"]
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
      await sgMail.send(sendGridMail, true); // choisir quel const utiliser pour l'envois de mail
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

const userValidateMissionMail = (
  userName: string,
  missionName: string,
  missionDate: string
) => {
  sgMail.setApiKey(process.env.KEY_SENDGRID);

  const sendGridMail = {
    to: "contact@lvp-web.fr", // multiple recipient, ["email1","email2"]
    from: "contact@lvp-web.fr",
    templateId: "d-8119a941b5e8486db725aad57e03d549",
    dynamic_template_data: {
      userName,
      missionName,
      missionDate,
    },
  };

  //envois du mail

  try {
    sgMail.send(sendGridMail, true); // choisir quel const utiliser pour l'envois de mail
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
};
const userRefuseMissionMail = (
  userName: string,
  missionName: string,
  missionDate: string
) => {
  sgMail.setApiKey(process.env.KEY_SENDGRID);

  const sendGridMail = {
    to: "contact@lvp-web.fr", // multiple recipient, ["email1","email2"]
    from: "contact@lvp-web.fr",
    templateId: "d-0aae0f8dc89c41b3a68a274224464354",
    dynamic_template_data: {
      userName,
      missionName,
      missionDate,
    },
  };

  //envois du mail

  try {
    sgMail.send(sendGridMail, true); // choisir quel const utiliser pour l'envois de mail

    return json({
      message: "EMAIL_SENDED_SUCCESSFULLY",
    });
  } catch {
    console.log("invitation non envoyée");

    return json({
      message: "ERROR_WITH_SENDGRID",
    });
  }
};

export const sendPendingUserToMission = async (
  userMail: string,
  missionId: string
) => {
  const token = crypto.randomBytes(16).toString("hex");
  //verif si mission déjà proposé ‼ NE FONCTIONNE PAS--- A VOIR
  if (typeof userMail !== "string") return;
  const allreadyIn = await prisma.pendingUserToMission.findFirst({
    where: { userMail, AND: { missionId } },
  });
  //verif a faire au actionFunction ou loader
  if (allreadyIn)
    return json({ error: "User is allready on the pending List" });

  const userFirstName = (
    await prisma.user.findUnique({ where: { email: userMail } })
  ).firstName;
  const missionInfos = await prisma.missions.findUnique({
    where: { id: missionId },
  });
  const missionName = missionInfos.missionName;
  const place = missionInfos.place;
  const beginAtMail = format(
    new Date(missionInfos.beginAt),
    "dd/MM/yyyy à HH:mm"
  );
  const beginAt = missionInfos.beginAt;
  const missionData = { missionId, missionName, place, beginAt };
  await prisma.user.update({
    where: { email: userMail },
    data: { pendingToken: { push: token } },
  });

  await prisma.pendingUserToMission.create({
    data: { userMail, ...missionData, token },
  });

  //send mail to user
  sendMail(userMail, userFirstName, token, missionName, place, beginAtMail);
  return json({ message: "Invitation sended" });
};
export const getUserByToken = async (token: string) => {
  const pendingMission = await prisma.pendingUserToMission.findUnique({
    where: { token },
  });

  if (!pendingMission) return false;
  const userMail = pendingMission.userMail;
  const user = await prisma.user.findUnique({
    where: { email: userMail },
    select: { pendingToken: true, id: true },
  });
  return user;
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
  //fonctionne pas
  /*  const haveTheToken = await prisma.user.findMany({
    where: { email: userMail, AND: { pendingToken: { has: token } } },
    select: { pendingToken: true },
  });
  if (!haveTheToken.length) return json({ message: "not found", status: 404 });
  console.log("token founded"); */

  const userHaveToken = await prisma.user.findFirst({
    where: { email: userMail, AND: { pendingToken: { has: token } } },
  });
  if (!userHaveToken) return false;
  console.log("He have the token");

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
  const missionName = pendingUserToMission.missionName;
  const missionDate = format(
    new Date(pendingUserToMission.beginAt),
    "dd/MM/yyyy à hh:mm"
  );

  await connectToMission(
    pendingUserToMission.userMail,
    pendingUserToMission.missionId
  );
  await prisma.user.update({
    where: { email: userMail },
    data: { pendingToken: { set: userPendingTokenArrayPullUsedToken } },
  });
  const user = await prisma.user.findUnique({ where: { email: userMail } });
  const userName = user.firstName + " " + user.lastName;

  userValidateMissionMail(userName, missionName, missionDate);
  await prisma.pendingUserToMission.delete({
    where: { token },
  });
  //récup user Name + firstName && récup missionName+ Mission Date && send Mail
  console.log("User is now connected");

  //redirect validatePage avec mission
  return true;
};
//function for rendering background on select but how???
export const userPendingInvitation = async (userMail: string) => {
  const pendingInvitation = await prisma.pendingUserToMission.findMany({
    where: { userMail },
  });
  return pendingInvitation;
};
export const refuseMissionToken = async (userMail: string, token: string) => {
  const haveTheToken = await prisma.user.findMany({
    where: { email: userMail, AND: { pendingToken: { has: token } } },
    select: { pendingToken: true },
  });
  const userTokenRes = await prisma.user.findUnique({
    where: { email: userMail },
    select: { pendingToken: true, firstName: true, lastName: true },
  });
  const userPendingTokenArrayPullUsedToken =
    userTokenRes.pendingToken &&
    userTokenRes.pendingToken.filter((tokens) => tokens !== token);

  const pendingUserToMission = await prisma.pendingUserToMission.findFirst({
    where: { userMail, AND: { token } },
  });

  if (!haveTheToken.length) return json({ message: "not found", status: 404 });
  console.log("token founded");
  await prisma.user.update({
    where: { email: userMail },
    data: { pendingToken: userPendingTokenArrayPullUsedToken },
  });
  const userName = userTokenRes.firstName + " " + userTokenRes.lastName;
  const missionName = pendingUserToMission.missionName;
  const missionDate = format(
    new Date(pendingUserToMission.beginAt),
    "dd/MM/yyyy à hh:mm"
  );
  userRefuseMissionMail(userName, missionName, missionDate);
  await prisma.pendingUserToMission.delete({
    where: { token },
  });
  console.log("User not connected and deleted from pendingList");

  return true;
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
  const userToDisconnect = await prisma.user.findUnique({
    where: { email: user },
  });
  const missionToDisconnect = await prisma.missions.findUnique({
    where: { id: mission },
  });

  if (!userToDisconnect || !missionToDisconnect)
    return json({ error: "Selected items are not valid" });

  const disconnect = await prisma.user.update({
    where: { email: user },
    data: { missions: { disconnect: { id: mission } } },
  });

  if (!disconnect)
    return json({ error: "Something went wrong on disconnection" });
  return json({ message: "User disconnected from the mission" });
};
export const pendingUserToMissionList = async () => {
  const list = await prisma.pendingUserToMission.findMany();
  return list;
};
export const deletePendingInvitation = async (token: string) => {
  const user = await getUserByToken(token);

  if (!user) return false;
  const userId = user.id;
  const userPendingTokenList = user.pendingToken;
  const newTokenList = userPendingTokenList.filter(
    (tokens) => tokens !== token
  );
  await prisma.user.update({
    where: { id: userId },
    data: { pendingToken: { set: newTokenList } },
  });
  return await prisma.pendingUserToMission.delete({
    where: { token },
  });
};
