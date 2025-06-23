import { auth } from "@/auth"
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

export const initialProfile = async ()=>{
    const session = await auth();
    if(!session?.user){
        return redirect("/login")
    }
    const profile = await prisma.profile.findUnique({
        where:{
            userId: session?.user?.id
        }
    })
    if(profile){
        return profile;
    }
    if (!session.user.id) {
        throw new Error("User ID is missing from session.");
    }
    const newProfile = await prisma.profile.create({
        data:{
            userId: session.user.id,
            imageUrl: "https://img.freepik.com/premium-vector/man-character_665280-46970.jpg" // Provide a default value or fetch from session/user if available
        }
    })
    return newProfile;
}