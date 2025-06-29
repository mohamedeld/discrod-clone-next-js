import { prisma } from "./prisma"

export const getOrCreateConversation = async(memberOneId:string,memberTwoId:string)=>{
    try{
        let conversation = await findConversation(memberOneId,memberTwoId) || await findConversation(memberTwoId,memberOneId);
        if(!conversation){
            conversation = await createNewConversation(memberOneId,memberTwoId);
        }
        return conversation;
    }catch(error){
        console.log(error);
        return null;
    }
}


export const findConversation = async (memberOneId:string,memberTwoId:string)=>{
   try{
     return await prisma.conversation.findFirst({
        where:{
            AND:[
                {MemberOneId:memberOneId},
                {MemberTwoId:memberTwoId}
            ]
        },
        include:{
            memberOne:{
                include:{
                    profile:{
                        include:{
                            user:true
                        }
                    }
                }
            },
            memberTwo:{
                include:{
                    profile:{
                        include:{
                            user:true
                        }
                    }
                }
            }
        }
    })
   }catch(error){
         console.log(error);
         return null;
   }
}

export const createNewConversation = async (memberOneId:string,memberTwoId:string)=>{
    try{
        return await prisma.conversation.create({
            data:{
                MemberOneId:memberOneId,
                MemberTwoId:memberTwoId
            },
            include:{
            memberOne:{
                include:{
                    profile:{
                        include:{
                            user:true
                        }
                    }
                }
            },
            memberTwo:{
                include:{
                    profile:{
                        include:{
                            user:true
                        }
                    }
                }
            }
        }
    })
    }catch(error){
        console.log(error);
        return null;
    }
}