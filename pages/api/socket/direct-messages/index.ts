import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    const profile = await prisma.profile.findUnique({
      where: {
        userId: session?.user?.id,
      },
    });
    const { content, fileUrl ='' } = await req.body;
    const { conversationId } = req.query;
    if (!profile) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!content) {
      return res
        .status(400)
        .json({ message: "Content or fileUrl is required" });
    }
    if (!conversationId) {
      return res
        .status(400)
        .json({ message: "conversationId are required" });
    }
    
    const conversation = await prisma.conversation.findFirst({
      where:{
        id:conversationId as string,
        OR:[
          {
            memberOne:{
              profileId:profile?.id
            }
          },
          {
            memberTwo:{
              profileId:profile?.id
            }
          }
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

    if(!conversation){
      return res.status(404).json({
        message:"Conversation not found"
      })
    }

    const member = conversation?.memberOne?.id === profile?.id ? conversation?.memberOne : conversation?.memberTwo;

    if (!member) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const message = await prisma.directMessage.create({
      data: {
        content,
        fileUrl,
       conversationId:conversationId as string,
        memberId: member?.id,
      },
      include: {
        member: {
          include: {
            profile: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
    const channelKey = `chat:${conversationId}:messages`;
    res?.socket?.server?.io?.emit(channelKey, message);
    return res.status(200).json(message);
  } catch (error) {
    console.log("Direct Message post", error);
    res.status(500).json({
      message: "Internal Error",
    });
  }
}
