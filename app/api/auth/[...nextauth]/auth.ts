import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaClient } from '@prisma/client';

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
      if (account && profile &&
      account.provider === "google" &&
      profile.email &&
      profile.email.endsWith("@ncssm.edu")) {
        const player = await prisma.user.findFirst({
          where: {
            email: profile.email
          }
        })

        if(!player) return prisma.gameConfiguration.findFirst({
          where: {
            key: "sign_ups_open"
          }
        }).then(res => res?.value == "yes");
        else return true

      }
      return false
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.email = profile.email
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {

      session.user.email = token.email

      if(session && token.email) {
        const player = await prisma.user.findFirst({
          where: {
            email: token.email
          }
        })

        if(!player) return session;

        if(player.currentTarget) session.user.currentTargetName = await prisma.user.findFirst({
          where: {
            id: parseInt(player.currentTarget)
          }
        }).then(res => {
          if(!res) return null;
          else return `${res.firstName} ${res.lastName}`
        })

        if(player.killedBy) session.user.killedByName = await prisma.user.findFirst({
          where: {
            id: parseInt(player.killedBy)
          }
        }).then(res => {
          if(!res) return null;
          else return `${res.firstName} ${res.lastName}`
        })

        if(player.killed) session.user.contesting = await prisma.kill.findFirst({
          where: {
            victimId: player.id
          }
        }).then(res => res?.contest) || false

        if(player.killed) session.user.approvedKill = await prisma.kill.findFirst({
          where: {
            victimId: player.id
          }
        }).then(res => res?.approved) || false

        session.user.id = player.id
        session.user.firstName = player.firstName
        session.user.lastName = player.lastName
        session.user.nickname = player.nickname
        session.user.phone = player.phone
        session.user.grade = player.grade
        session.user.hallId = player.hallId
        session.user.totalKills = player.totalKills
        session.user.currentTarget = player.currentTarget
        session.user.previousKills = player.previousKills
        session.user.killed = player.killed
        session.user.killedBy = player.killedBy
        session.user.gamemaster = player.gamemaster
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