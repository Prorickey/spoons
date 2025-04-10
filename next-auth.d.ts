import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: number,
      gamemaster: boolean,
      nickname: string,
      firstName: string,
      lastName: string,
      hallId: string,
      grade: string,
      phone: string,
      totalKills: number,
      currentTarget: string | null,
      currentTargetName: string | null,
      previousKills: string[],
      killed: boolean,
      killedBy: string | null,
      killedByName: string | null,
      contesting: boolean,
      approvedKill: boolean,
      update: () => Promise<void>

    } & DefaultSession["user"]
  }
}