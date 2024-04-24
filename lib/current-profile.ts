import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export const currentProfile = async () => {
  const { userId } = auth();
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
