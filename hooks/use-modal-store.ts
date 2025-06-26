import { Server } from "@/lib/generated/prisma";
import {create} from "zustand";

export type ModalType = "createServer";

interface ModalData{
    server?:Server
}

interface ModalStore {
    type: ModalType | null;
    isOpen:boolean;
    onOpen:(type:ModalType)=> void;
    onClose:()=> void;
    data:ModalData;
    setData: (data: ModalData) => void;
}

export const useModal = create<ModalStore>((set)=>({
    type:null,
    isOpen:false,
    onOpen:(type)=> set({isOpen:true,type}),
    onClose:()=> set({isOpen:false,type:null}),
    data:{},
    setData: (data) => set({ data }),
}))