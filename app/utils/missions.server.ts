import { json } from "@remix-run/node";
import { prisma } from "./prisma.server";

type CreateForm = {
  creatorId: string;
  missionName: string;
  place: string;
  beginAt: Date;
  endAt: Date;
};

type UpdateForm = {
  missionName: string;
  place: string;
  beginAt: Date;
  endAt: Date;
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
  const getDifference = (start: Date, end: Date) => {
    const diffMillisecond = end.getTime() - start.getTime();
    return {
      hours: Math.floor(diffMillisecond / (1000 * 60 * 60)),
      minutes: Math.ceil(diffMillisecond / (1000 * 60)) % 60,
    };
  };
  const time = getDifference(form.beginAt, form.endAt);
  const duration =
    time.hours.toString() +
    ":" +
    (time.minutes < 10
      ? "0" + time.minutes.toString()
      : time.minutes.toString());
  const createdMission = await prisma.missions.create({
    data: { ...form, duration },
  });

  if (!createdMission)
    return json({ errorCreation: "Erreur lors de la création de la mission" });
  console.log("toto à réussi a créer la mission!");
  //redirect mission plus message
  return json({ message: "Mission créer avec succès" });
};
export const getMissions = async () => {
  return await prisma.missions.findMany({});
};
export const getMissionInformation = async (id: string) => {
  if (!id) return json({ errorMessage: "Mission non trouvé" });
  return await prisma.missions.findUnique({ where: { id } });
};
export const deleteMission = async (id: string) => {
  if (!id) return json({ errorMessage: "Mission non trouvé" });
  return await prisma.missions.delete({ where: { id } });
};
export const updateMission = async (id: string, updateForm: UpdateForm) => {
  return "toto";
};
