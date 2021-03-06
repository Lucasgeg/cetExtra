import { json, redirect } from "@remix-run/node";
import { prisma } from "./prisma.server";

type CreateForm = {
  creatorId: string;
  missionName: string;
  place: string;
  beginAt: string;
  endAt: string;
  lat: number;
  lng: number;
};

type UpdateForm = {
  missionName: string;
  place: string;
  lat: number;
  lng: number;
  beginAt: string;
  endAt: string;
};
export const getDifference = (start: Date, end: Date) => {
  const diffMillisecond = end.getTime() - start.getTime();
  return {
    hours: Math.floor(diffMillisecond / (1000 * 60 * 60)),
    minutes: Math.ceil(diffMillisecond / (1000 * 60)) % 60,
  };
};
export const createMission = async (form: CreateForm) => {
  //error
  if (form.missionName.length < 4)
    return json({ errorName: "Le nom doit faire minimum 4 lettres" });
  if (form.place.length < 4)
    return json({ errorPlace: "Le lieu doit faire minimum 4 lettres" });
  if (!form.beginAt || !form.endAt)
    return json({
      errorTime: "Une heure de début et de fin doivent être sélectionnée",
    });

  const beginAt = new Date(form.beginAt);
  const endAt = new Date(form.endAt);
  const time = getDifference(beginAt, endAt);
  const duration =
    time.hours.toString() +
    ":" +
    (time.minutes < 10
      ? "0" + time.minutes.toString()
      : time.minutes.toString());

  const createdMission = await prisma.missions.create({
    data: { ...form, duration, beginAt, endAt },
  });

  if (!createdMission) return false;

  console.log("toto à réussi a créer la mission!");
  //redirect mission plus message
  throw redirect("/adminroutes/missions");
};
export const getMissions = async () => {
  const today = new Date();

  const futureMisions = await prisma.missions.findMany({
    where: {
      beginAt: { gte: today },
    },
    orderBy: { beginAt: "asc" },
  });
  const pastMissions = await prisma.missions.findMany({
    where: {
      beginAt: { lte: today },
    },
  });
  return { futureMisions: futureMisions, pastMissions: pastMissions };
};
export const getMissionInformation = async (id: string) => {
  if (!id) return json({ error: "Mission non trouvé" });
  const mission = await prisma.missions.findUnique({
    where: { id },
    include: {
      users: {
        select: { lastName: true, firstName: true, id: true, email: true },
      },
    },
  });
  return mission;
};
export const deleteMission = async (id: string) => {
  if (!id) return json({ errorMessage: "Mission non trouvé" });
  await deleteUsersOnTheMission(id);
  await prisma.missions.delete({ where: { id } });

  return json("Mission deleted successfully", {
    status: 200,
  });
};
export const updateMission = async (id: string, updateForm: UpdateForm) => {
  const mission = await prisma.missions.findUnique({ where: { id } });
  if (!mission) return json({ error: "Mission not found :(" });
  const beginAt = new Date(updateForm.beginAt);
  const endAt = new Date(updateForm.endAt);
  const time = getDifference(beginAt, endAt);
  const duration =
    time.hours.toString() +
    ":" +
    (time.minutes < 10
      ? "0" + time.minutes.toString()
      : time.minutes.toString());
  await prisma.missions.update({
    where: { id },
    data: { ...(updateForm || undefined), beginAt, endAt, duration },
  });
  console.log("Toto à modifier la mission!");
  return { message: "Toto à réussi la modif!" };
};
export const deleteUsersOnTheMission = async (id: string) => {
  const usersOnTheMission = await prisma.user.findMany({
    where: { missionIDs: { has: id } },
    select: { missionIDs: true, email: true },
  });
  usersOnTheMission.map(async (user) => {
    const userMissionsIdsWithoutThisMission =
      user.missionIDs && user.missionIDs.filter((ids) => ids !== id);
    console.log(user.email);
    console.log("userMissions " + user.missionIDs);
    console.log(
      "userMissions - mission a retiré: " + userMissionsIdsWithoutThisMission
    );

    console.log("toto retire la missionId de chaque user");

    const update = await prisma.user.update({
      where: { email: user.email },
      data: { missionIDs: { set: userMissionsIdsWithoutThisMission } },
    });
    console.log(update);
    return update;
  });

  return "toto";
};
