"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";

import { useOrigin } from "@/hooks/use-origin";
import { ServerWithMembersWithProfiles } from "@/type";
import { DialogDescription } from "@radix-ui/react-dialog";
import { ScrollArea } from "../ui/scroll-area";

export const EditMembersModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();

  const origin = useOrigin();
  const { server } = data as { server: ServerWithMembersWithProfiles };

  const isModalOpen = isOpen && type === "members";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>

          <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members.map((member) => (
            <div className="flex items-center gap-x-2 mb-6" key={member.id}>
              <UserAvater />
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
