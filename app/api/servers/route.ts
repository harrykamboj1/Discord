import { currentProfile } from "@/lib/current-profile";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
      },
    });
  } catch (err) {
    console.error("[SERVERS_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
