"use client";
import { MemberRole } from "@/lib/generated/prisma"
import { ServerWithMembersWithProfiles, ServerWithMembersWithProfilesAndUsers } from "@/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";
import InviteModal from "../modals/InviteModal";
import CreateServerModal from "../modals/CreateServerModal";
import MemberModal from "../modals/MemberModal";

interface IProps{
    server:ServerWithMembersWithProfiles;
    role?:MemberRole;
}
const ServerHeader = ({server,role}:IProps) => {
    const isAdmin = role === MemberRole.ADMIN;
    const isModerator = role === MemberRole.ADMIN || MemberRole.MODERATOR;


  return (
    <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none" asChild>
            <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
                {server?.name}
                <ChevronDown className="h-5 w-5 ml-auto"/>
            </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
            {isModerator && (
                <DropdownMenuItem className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer" onSelect={(e)=> e.preventDefault()}>
                    <InviteModal server={server}/>
                    <UserPlus className="h-4 w-4 ml-auto"/>
                </DropdownMenuItem>
            )}
            {isAdmin && (
                <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer" onSelect={(e)=> e.preventDefault()}>
                    <CreateServerModal isUpdate={true} server={server}/>
                    <Settings className="h-4 w-4 ml-auto"/>
                </DropdownMenuItem>
            )}
            {isAdmin && (
                <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer" onSelect={(e)=>{ e.preventDefault()
                                                        e.stopPropagation();

                }}>
                   <MemberModal server={server as ServerWithMembersWithProfilesAndUsers}/>
                    <Users className="h-4 w-4 ml-auto"/>
                </DropdownMenuItem>
            )}
            {isModerator && (
                <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer">
                    Create Channel
                    <PlusCircle className="h-4 w-4 ml-auto"/>
                </DropdownMenuItem>
            )}
            {isModerator && (
                <DropdownMenuSeparator/>
            )}
            {isAdmin && (
                <DropdownMenuItem className="text-rose-500 px-3 py-2 text-sm cursor-pointer">
                    Delete Server
                    <Trash className="h-4 w-4 ml-auto"/>
                </DropdownMenuItem>
            )}
            {!isAdmin && (
                <DropdownMenuItem className="text-rose-500 px-3 py-2 text-sm cursor-pointer">
                    Leave Server
                    <LogOut className="h-4 w-4 ml-auto"/>
                </DropdownMenuItem>
            )}
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ServerHeader