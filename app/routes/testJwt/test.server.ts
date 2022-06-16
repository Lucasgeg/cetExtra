import jwt from "jsonwebtoken";

export const getToken = async (req) => {
  const toto = jwt.sign({ req }, process.env.JWT_ACCES_TOKEN, {
    expiresIn: 1000 * 60 * 60 * 24,
  });
  console.log(toto);
  return toto;
};
