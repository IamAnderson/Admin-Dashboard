"use client"
import React from "react";
import Modal from "@/components/ui/modal";
import { UseStoreModal } from "@/hooks/use-store-modal";

export default function SetupPage() {
  const onOpen = UseStoreModal((state) => state.onOpen);
  const isOpen = UseStoreModal((state) => state.isOpen);


  React.useEffect(() => {
    if(!isOpen){
      onOpen();
    }
  }, [isOpen, onOpen]);

  return (
    <div className='p-4'>
      Root Page
    </div>
  )
}
