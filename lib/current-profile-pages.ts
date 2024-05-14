"use client";
import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextApiRequest } from "next";

export const currentProfile = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return null;
  } else {
    console.log("userId exist :: " + userId);
  }

  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  });

  console.log("profile exist :: " + profile);
  return profile;
};
