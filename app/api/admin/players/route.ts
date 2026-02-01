import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { notFound } from 'next/navigation';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session && session.user.gamemaster) {
    const players = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        nickname: true,
        firstName: true,
        lastName: true,
        hallId: true,
        grade: true,
        phone: true,
        totalKills: true,
        currentTarget: true,
        killed: true,
        killedBy: true,
        gamemaster: true,
      },
    });

    return Response.json({ players });
  } else return notFound();
}
