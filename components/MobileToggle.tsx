import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import NavigationSidebar from "./nav/NavigationSidebar";
import ServerSidebar from "./server/ServerSidebar";
interface IProps{
    serverId:string;
}
const MobileToggle = ({serverId}:IProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button asChild size={"icon"} variant={"ghost"} className="md:hidden">
            <Menu/>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0">
        <SheetHeader>
          <SheetTitle></SheetTitle>
          <SheetDescription>
           
          </SheetDescription>
        </SheetHeader>
       <div className="flex h-full">
         <div className="w-[72px]">
            <NavigationSidebar/>
        </div>
        <ServerSidebar serverId={serverId}/>
       </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;
