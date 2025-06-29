import {Server as NetServer, Socket} from "net";
import {NextApiResponse} from "next";
import {Server as SocketIOServer} from "socket.io";

import { Member, Profile, Server } from "./lib/generated/prisma"

export type ServerWithMembersWithProfiles = Server & {
    members:(Member & {profile:Profile})[]
}

export type ServerWithMembersWithProfilesAndUsers = Server & {
  members: (Member & {
    profile: Profile & {
      user: User
    }
  })[]
}

export type MemberWithProfileAndUser = Member & {
  profile: Profile & {
    user: User;
  };
};

export type NextApiResponseServerIo = NextApiResponse & {
    socket:Socket & {
        server:NetServer & {
            io:SocketIOServer
        }
    }
}