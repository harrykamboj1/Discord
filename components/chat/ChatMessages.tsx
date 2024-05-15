"use client";

import { Member } from "@prisma/client";
import ChatWelcome from "./chat-welcome";

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

const ChatMessage = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) => {
  return (
    <div className="flex flex-1 flex-col py-4 overflow-y-auto">
      <div className="flex-1">
        <ChatWelcome type={type} name={name} />
      </div>
    </div>
  );
};

export default ChatMessage;
