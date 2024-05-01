"use client";

import { ServerWithMembersWithProfiles } from "@/type";
import { MemberRole, Server } from "@prisma/client";
import { DropdownMenu } from "@/components/ui/dropdown-menu";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}
const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;
  return (
    <div>
      <DropdownMenu></DropdownMenu>
    </div>
  );
};

export default ServerHeader;
