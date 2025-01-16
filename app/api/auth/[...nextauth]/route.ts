import { PrismaClient } from '@prisma/client';
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from "next-auth/providers/google";

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account && profile && account.provider === "google") {
        return profile.email?.endsWith("@ncssm.edu") == true
      }
      return false
    },
    async jwt({ token, account }) {
      if (account) {
        token.email = account.userId
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token, user }) {

      session.user.email = token.email

      if(session && token.email && user.emailVerified) {
        const player = await prisma.user.findFirst({
          where: {
            email: token.email
          }
        })

        if (!player) return session

        session.user.firstName = player.firstName
        session.user.lastName = player.lastName
        session.user.nickname = player.nickname
        session.user.phone = player.phone
        session.user.grade = player.grade
        session.user.hallId = player.hallId
        session.user.gamemaster = player.gamemaster
        session.user.totalKills = player.totalKills
        session.user.currentTarget = player.currentTarget
        session.user.previousKills = player.previousKills
        session.user.killed = player.killed
        session.user.killedBy = player.killedBy
      }

      return session
    }
  },
  theme: {
    logo: "/favicon.png",
    brandColor: "#000000",
    colorScheme: "dark"
  },
  pages: {
    signIn: "/auth/signin"
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST, authOptions as OPTIONS }