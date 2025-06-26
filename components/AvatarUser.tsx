"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import Link from "next/link";
interface IProps{
    name:string;
}
const AvatarUser = ({name}:IProps) => {
    const handleLogout = async ()=>{
        await signOut();
    }
  return (
    <Popover>
      <PopoverTrigger>
        <Avatar>
          <AvatarImage src="/avatar.png" />
          <AvatarFallback>{name?.slice(0,2)?.toUpperCase()}</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-2 items-center">
            <Link href={"/"} className="flex">Profile</Link>
            <button onClick={handleLogout} className="py-2 w-full  transition cursor-pointer">Logout</button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AvatarUser;
