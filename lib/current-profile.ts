import { getServerSession } from "next-auth";
import { prisma } from "./prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
export const getUserSession = async ()=>{
    const session = await getServerSession(authOptions);
    if(!session || !session?.user){
        return null;
    }
    return {
        user:session?.user
    }
};

export const currentProfile = async ()=>{
    const session = await getUserSession();
    
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