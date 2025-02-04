import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function POST() {
  const session = await getServerSession(authOptions)
  if(session) {
    if(!session.user.killed) return new NextResponse(
      "You have not been eliminated from the game", {
        status: 450
      })

    const prisma = new PrismaClient()

    await prisma.kill.update({
      where: {
        victimId: session.user.id
      },
      data: {
        approved: true,
        contest: false
      }
    })

    return new NextResponse("OK", { status: 200 })
  }
}