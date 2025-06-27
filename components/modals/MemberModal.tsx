"use client";
import queryString from "query-string";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {  ServerWithMembersWithProfilesAndUsers } from "@/types";
import { ScrollArea } from "../ui/scroll-area";
import MemberAvatar from "../MemberAvatar";
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MemberRole } from "@/lib/generated/prisma";
import { toast } from "sonner";
import axios from "axios";

const roleIconMap = {
  "GUEST":null,
  "MODERATOR":<ShieldCheck className="w-4 h-4 ml-2 text-indigo-500"/>,
  "ADMIN":<ShieldCheck className="w-4 h-4 text-rose-500"/>
}

interface IProps {
  server: ServerWithMembersWithProfilesAndUsers;
}
const MemberModal = ({ server }: IProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loadingId,setLoadingId] = useState("");

  const onKick = async (memberId:string)=>{
    try{
      setLoadingId(memberId);
      const url = queryString.stringifyUrl({
        url:`/api/members/${memberId}`,
        query:{
          serverId:server?.id
        }
      })
      const response = await axios.delete(url);
      if(response?.status === 200){
        router.refresh();
        toast.success("Deleted successfully");
      }
    }catch(error){
      if(axios.isAxiosError(error) && error?.response){
        toast.error(error?.response?.data?.message)
      }else{
        toast.error((error as Error)?.message || "Something went wrong")
      }
    }finally{
      setLoadingId("")
    }
  }

  const onRoleChange = async (memberId:string,role:MemberRole)=>{
    try{
      setLoadingId(memberId);
      const url = queryString.stringifyUrl({
        url:`/api/members/${memberId}`,
        query:{
          serverId:server?.id,
          memberId
        }
      })
      const response = await axios.patch(url,{role});
      if(response?.status === 200){
        router.refresh();
        toast.success("Role changed successfully");
      }
    }catch(error){
      if(axios.isAxiosError(error) && error?.response){
        toast.error(error?.response?.data?.message)
      }else{
        toast.error((error as Error)?.message || "Something went wrong")
      }
    }finally{
      setLoadingId("")
    }
  }


  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger> Manage Members</DialogTrigger>
        <DialogContent className="bg-white text-black">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-center text-2xl font-bold">
              Manage Members
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              {server?.members?.length} Member{server?.members?.length > 1 ? 's' :''}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="mt-8 max-h-[420px] pr-6">
            {server?.members?.map((member)=>{
              return (
                <div key={member?.id} className="flex items-center gap-x-2 mb-6">
                    <MemberAvatar src={member?.profile?.imageUrl}/>
                    <div className="flex flex-col gap-y-1">
                      <div className="text-xs font-semibold flex items-center gap-x-1">
                        {member?.profile?.user?.name}
                        {roleIconMap[member?.role]}
                      </div>
                      <p className="text-xs text-zinc-500">{member?.profile?.user?.email}</p>
                    </div>
                    <div className="ml-auto">
                        
                      </div>
                      {/* server?.profileId !== member?.profileId && loadingId !== member?.id  */}
                    {server?.profileId !== member?.profileId && loadingId !== member?.id&& (
                      <div className="ml-auto">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <MoreVertical className="h-4 w-4 text-zinc-500"/>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="left">
                           <DropdownMenuItem onSelect={(e)=> e.preventDefault()} onClick={()=> onRoleChange(member?.id,"GUEST")}>
                                    <Shield className="w-4 h-4 mr-2"/>
                                    Guest
                                    {member?.role === "GUEST" && (
                                      <Check className="w-4 h-4 ml-auto"/>
                                    )}
                                  </DropdownMenuItem>
                           <DropdownMenuItem onSelect={(e)=> e.preventDefault()} onClick={()=> onRoleChange(member?.id,"MODERATOR")}>
                                    <ShieldCheck className="w-4 h-4 mr-2"/>
                                    Moderator
                                    {member?.role === "MODERATOR" && (
                                      <Check className="w-4 h-4 ml-auto"/>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator/>
                                   <DropdownMenuItem onSelect={(e)=> e.preventDefault()} onClick={()=> onKick(member?.id)}>
                                    <Gavel className="h-4 w-4 mr-2"/>
                                    Kick
                                   </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                    {loadingId === member?.id && (
                      <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4"/>
                    )}
                </div>
              )
            })}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MemberModal;
