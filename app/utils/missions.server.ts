import { json } from "@remix-run/node";
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
  console.log(typeof form.lat);

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

  if (!createdMission)
    return json({ errorCreation: "Erreur lors de la création de la mission" });
  console.log("toto à réussi a créer la mission!");
  //redirect mission plus message
  return json({ message: "Mission créer avec succès" });
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
  if (!id) return json({ errorMessage: "Mission non trouvé" });
  return await prisma.missions.findUnique({ where: { id } });
};
export const deleteMission = async (id: string) => {
  if (!id) return json({ errorMessage: "Mission non trouvé" });
  console.log("Toto à bien supprimé!");
  return await prisma.missions.delete({ where: { id } });
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
