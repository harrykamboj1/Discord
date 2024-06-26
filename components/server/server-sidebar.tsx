import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import { ServerSearch } from "./server-search";
import { Hash, ShieldAlert, ShieldCheck } from "lucide-react";
import { Separator } from "../ui/separator";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import ServerMember from "./server-member";

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  // [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  // [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-indigo-500" />,
};

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  // const audioChannels = server?.channels.filter(
  //   (channel) => channel.type === ChannelType.AUDIO
  // );
  // const videoChannels = server?.channels.filter(
  //   (channel) => channel.type === ChannelType.VIDEO
  // );
  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );
  // console.log(videoChannels);
  console.log(members);
  if (!server) {
    return redirect("/");
  }

  const role = server?.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              // {
              //   label: "Voice Channels",
              //   type: "channel",
              //   data: audioChannels?.map((channel) => ({
              //     id: channel.id,
              //     name: channel.name,
              //     icon: iconMap[channel.type],
              //   })),
              // },
              // {
              //   label: "Video Channels",
              //   type: "channel",
              //   data: videoChannels?.map((channel) => ({
              //     id: channel.id,
              //     name: channel.name,
              //     icon: iconMap[channel.type],
              //   })),
              // },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleMap[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              label="Text Channels"
              channelType={ChannelType.TEXT}
              sectionType="channels"
              role={role}
            />
            {textChannels.map((channel) => (
              <ServerChannel
                channel={channel}
                role={role}
                key={channel.id}
                server={server}
              />
            ))}
          </div>
        )}
        {/* {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              label="Voice Channels"
              channelType={ChannelType.AUDIO}
              sectionType="channels"
              role={role}
            />
            {audioChannels.map((channel) => (
              <ServerChannel
                channel={channel}
                role={role}
                key={channel.id}
                server={server}
              />
            ))}
          </div>
        )} */}

        {/* {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              label="Video Channels"
              channelType={ChannelType.VIDEO}
              sectionType="channels"
              role={role}
            />
            {videoChannels.map((channel) => (
              <ServerChannel
                channel={channel}
                role={role}
                key={channel.id}
                server={server}
              />
            ))}
          </div>
        )} */}
        {!!members?.length && (
          <div className="mb-2">
            <ServerSection
              label="Members"
              sectionType="members"
              role={role}
              server={server}
            />
            {members?.map((member) => (
              <ServerMember member={member} server={server} key={member.id} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
