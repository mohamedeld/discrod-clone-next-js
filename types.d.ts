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
