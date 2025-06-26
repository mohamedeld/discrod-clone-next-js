import { auth } from "@/auth"
import { prisma } from "./prisma";

export const currentProfile = async ()=>{
    const session = await auth();
    if(!session?.user){
        return null;
    }
    const profile = await prisma.profile.findUnique({
        where:{
            userId:session?.user?.id
        }
    })
    return profile;
}