import { currentProfile } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/type";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const profile = await currentProfile(req);
    const { messageId, serverId, channel } = req.query;
    const { content } = req.body;
    if (!profile) {
      return res.status(401).json({ error: "UnAuthorized" });
    }
    if (!serverId) {
      return res.status(400).json({ error: "Server Id missing" });
    }

    if (!channel) {
      return res.status(400).json({ error: "Channel Id missing" });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json({ error: "Server not found" });
    }

    const channelNew = await db.channel.findFirst({
      where: {
        id: channel as string,
        serverId: serverId as string,
      },
    });

    if (!channelNew) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channel as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isMessageOwner = member.id === message.memberId;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ error: "UnAuthorized" });
    }

    if (req.method === "DELETE") {
      message = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          fileUrl: null,
          content: "This message has been deleted.",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({
          error: "UnAuthorized",
        });
      }

      message = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${channel}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (e) {
    console.log("MESSAGE_ERROR", e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
