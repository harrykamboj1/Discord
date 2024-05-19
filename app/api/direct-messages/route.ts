import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { DirectMessage, Message } from "@prisma/client";
import { db } from "@/lib/db";

const MESSAGES_BATCH = 10;
export async function GET(req: Request) {
  try {
    const profile = currentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");

    if (!profile) {
      return new NextResponse("unAuthorized", { status: 401 });
    }
    if (!conversationId) {
      return new NextResponse("conversation Id is missing", { status: 400 });
    }

    let messages: DirectMessage[] = [];

    if (cursor) {
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;
    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (e) {
    console.log("[DIRECT_MESSAGES_GET]", e);
    return NextResponse.json("SOMETHING_WENT_WRONG", { status: 500 });
  }
}
