import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (session) {
    if (!session.user.killed)
      return new NextResponse('You have not been eliminated from the game', {
        status: 450,
      });

    await prisma.kill.update({
      where: {
        victimId: session.user.id,
      },
      data: {
        contest: true,
      },
    });

    return new NextResponse('OK', { status: 200 });
  }
}
