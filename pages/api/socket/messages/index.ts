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
    const { content, fileUrl } = await req.body;
    const { serverId, channelId } = req.query;
    if (!profile) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!content && !fileUrl) {
      return res
        .status(400)
        .json({ message: "Content or fileUrl is required" });
    }
    if (!serverId || !channelId) {
      return res
        .status(400)
        .json({ message: "ServerId and channelId are required" });
    }
    const server = await prisma.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile?.id,
          },
        },
      },
      include: {
        members: true,
      },
    });
    if (!server) {
      return res.status(404).json({ message: "Server not found" });
    }
    const channel = await prisma.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: server.id,
      },
    });
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    const member = server?.members?.find((m) => m.profileId === profile?.id);

    if (!member) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const message = await prisma.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
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
    const channelKey = `chat:${channelId}:messages`;
    res?.socket?.server?.io?.emit(channelKey, message);
    return res.status(200).json(message);
  } catch (error) {
    console.log("Message post", error);
    res.status(500).json({
      message: "Internal Error",
    });
  }
}
