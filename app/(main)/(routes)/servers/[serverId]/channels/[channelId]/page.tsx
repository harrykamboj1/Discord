import ChatHeader from "@/components/chat/ChatHeader";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ChannelIdPageParams {
  params: {
    serverId: string;
    channelId: string;
  };
}
const ChannelIdPage = async ({ params }: ChannelIdPageParams) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) {
    redirect("/");
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channel?.name}
        type="channel"
        serverId={channel?.serverId ?? ""}
      />
    </div>
  );
};
export default ChannelIdPage;
