import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {

      gamemaster: boolean,
      nickname: string,
      firstName: string,
      lastName: string,
      hallId: string,
      grade: string,
      phone: string,
      totalKills: number,
      currentTarget: string | null,
      previousKills: string[],
      killed: boolean,
      killedBy: string | null,
      update: () => Promise<void>

    } & DefaultSession["user"]
  }
}