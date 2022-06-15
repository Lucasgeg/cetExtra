import { createCookieSessionStorage, json, redirect } from "@remix-run/node";
import { prisma } from "./prisma.server";
import { createUser } from "./users.server";
import bcrypt from "bcryptjs";
const token = process.env.TOKEN_SECRET;
if (!token) {
  throw new Error("TOKEN_SECRET must be set");
}

////////////////////////////////SESSION//////////////////////////////////////////

const storage = createCookieSessionStorage({
  cookie: {
    name: "Auth_Session",
    secure: process.env.NODE_ENV == "production",
    secrets: [token],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export const createUserSession = async (userId: string, redirectTo: string) => {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
};

///////////////////////////////////////////TYPES//////////////////////////////////////////////////////
export type RegisterForm = {
  email: string;
  password: string;
  validatePassword: string;
  birthday: string;
  birthCity: string;
  firstName: string;
  lastName: string;
};
export type LoginForm = {
  email: string;
  password: string;
};
///////////////////////////////////////////FUNCTIONS//////////////////////////////////////////////////
function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("cookie"));
}
export async function getUserId(request: Request) {
  const session = await getUserSession(request);

  const userId = session.get("userId");

  if (!userId || typeof userId !== "string") return null;
  return userId;
}
export async function getUser(request: Request) {
  const userId = await getUserId(request);

  if (typeof userId !== "string") return null;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        birthCity: true,
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
  } catch {
    throw logout(request);
  }
}
export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

export const register = async (form: RegisterForm) => {
  const email = form.email.toString().toLowerCase().trim();
  const password = form.password.toString().trim();
  const validatePassword = form.validatePassword.toString().trim();
  const birthCity = form.birthCity.toString().toLowerCase().trim();
  const birthday = form.birthday.toString().toLowerCase().trim();
  const validEmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  if (validEmailRegex.test(email) == false) {
    return json({ error: "Incorrect email format" });
  }
  const userExist = await prisma.user.count({
    where: { email },
  });
  if (userExist) {
    return json({ error: "Email allready taken" }, { status: 400 });
  }
  const validPasswordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  if (!password.length || !validPasswordRegex.test(password)) {
    return json({
      error:
        "Password must be at least 8 character, one letter, one special character",
    });
  }
  if (validatePassword !== password)
    return json({ error: "Passwords doesn't match" });

  const newUser = await createUser(form);

  if (!newUser) {
    return json(
      { error: "Something went wrong on creation process" },
      { status: 400 }
    );
  }
  return createUserSession(newUser.id, "/");
  //return json({ error: "Check you mail for validation" });
};
export const login = async (form: LoginForm) => {
  const userEmail = form.email.toLowerCase().trim();
  const userIsPending = await prisma.pendingUser.findUnique({
    where: { email: userEmail },
  });
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });
  if (userIsPending) return json({ error: "Account is not validated" });
  if (!user || !(await bcrypt.compare(form.password, user.password))) {
    return json({ error: "Invalid username or password" }, { status: 400 });
  }
  return createUserSession(user.id, "/");
};
