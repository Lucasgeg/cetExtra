import { useUser } from "@clerk/remix";
import { redirect } from "@remix-run/node";
import React from "react";

const IsSigned = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  if (!user || !isSignedIn) return redirect("/sign-in");
  return true;
};

export default IsSigned;
