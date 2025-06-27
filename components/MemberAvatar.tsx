import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface IProps{
    src?:string;
    className?:string;
}

const MemberAvatar = ({src,className}:IProps) => {
  return (
     <Avatar className={cn(
        "h-7 w-7 md:h-10 md:w-10",className
     )}>
          <AvatarImage src={src || "/avatar.png"} alt="user image" />
        </Avatar>
  )
}

export default MemberAvatar