"use client";

import { CreateServerModal } from "@/components/modals/create-modal-server";
import { useEffect, useState } from "react";
import { InviteModal } from "@/components/modals/invite-modal";
import { EditServerModal } from "../modals/edit-server-modal";
import { EditMembersModal } from "../modals/edit-members";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <EditMembersModal />
    </>
  );
};
