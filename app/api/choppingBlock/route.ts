import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { notFound } from 'next/navigation';

export async function GET() {
  const ffa = await prisma.gameConfiguration.findUnique({
    where: {
      key: 'ffa',
    },
  });

  if (ffa?.value != 'true') return notFound();

  const session = await getServerSession(authOptions);
  if (session && !session.user.killed) {
    try {
      let alivePlayers = await prisma.user.findMany({
        where: {
          killed: false,
        },
        select: {
          firstName: true,
          lastName: true,
          id: true,
        },
      });

      alivePlayers = alivePlayers.filter(
        (player) => player.id != session.user.id
      );

      return Response.json(alivePlayers, { status: 200 });
    } catch {
      return Response.json(
        { error: 'Failed to fetch players' },
        { status: 500 }
      );
    }
  } else return notFound();
}
