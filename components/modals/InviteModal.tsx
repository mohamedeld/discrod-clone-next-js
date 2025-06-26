"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { Server } from "@/lib/generated/prisma";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

interface IProps {
  server: Server;
}
const InviteModal = ({ server }: IProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const origin = useOrigin();
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };


  const onNew = async ()=>{
    try{
      setIsLoading(true);
      const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);
      if(response?.status === 200){
        toast.success("Invite code generated successfully");
        router.refresh();
      }
    }catch(error){
      if(axios.isAxiosError(error) && error?.response){
        toast.error(error?.message)
      }else{
        toast.error((error as Error)?.message || "Something went wrong")
      }
    }finally{
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>Invite People</DialogTrigger>
        <DialogContent className="bg-white text-black p-0">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-center text-2xl font-bold">
              Invite Friends
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="p-6">
            <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
              Server invite link
            </Label>
            <div className="flex items-center mt-2 gap-x-2">
              <Input
              disabled={isLoading}
                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                value={inviteUrl}
              />
              <Button size={"icon"} disabled={isLoading} onClick={onCopy}>
                {isCopied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <Button
            disabled={isLoading}
              variant={"link"}
              size={"sm"}
              onClick={onNew}
              className="text-xs text-zinc-500 mt-4"
            >
              {isLoading ? 'Generating...':'Generate a new link'}
              <RefreshCw className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InviteModal;
