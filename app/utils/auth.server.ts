import { createCookieSessionStorage, json, redirect } from "@remix-run/node";
import { prisma } from "./prisma.server";
import { createUser } from "./users.server";
const { isEmail } = require("validator");
const token = process.env.TOKEN_SECRET;
if (!token) {
  throw new Error("TOKEN_SECRET must be set");
}

////////////////////////////////SESSION//////////////////////////////////////////

const storage = createCookieSessionStorage({
  cookie: {
    name: "Auth_Process_Id=valid",
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
};
export type LoginForm = {
  email: string;
  password: string;
};
///////////////////////////////////////////FUNCTIONS//////////////////////////////////////////////////
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

  return await createUser(form), redirect("/");
};
export const login = async (form: LoginForm) => {
  const email = form.email.toString().toLowerCase().trim();
  const password = form.password.toString().trim();
};
