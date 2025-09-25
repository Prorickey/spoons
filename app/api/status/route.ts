import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

// We can do this because the spoonmaster is on the same server
// meaning the latency is very, very low
export async function GET() {
  const prisma = new PrismaClient();
  const status = await prisma.gameConfiguration.findUnique({
    where: {
      key: 'status',
    },
  });

  const ffa = await prisma.gameConfiguration.findUnique({
    where: {
      key: 'ffa',
    },
  });

  return Response.json({ status: status?.value, ffa: ffa?.value == 'true' });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session && session.user.gamemaster) {
    const { state, ffa }: { state?: string; ffa?: boolean } =
      await request.json();

    if (state) {
      switch (state) {
        case 'PREGAME': {
          break;
        }

        case 'RUNNING': {
          const r = await fetch(
            `http://${process.env.SPOONMASTER_HOST}:${process.env.SPOONMASTER_PORT}/startgame`,
            {
              method: 'POST',
            }
          ).then((res) => res.json());

          if (!r['error']) return Response.json({ error: r['error'] });
          else return new Response('Started Game', { status: 200 });
        }

        case 'POSTGAME': {
          break;
        }

        default: {
          return Response.json(
            { error: 'Invalid game state' },
            { status: 400 }
          );
        }
      }
    } else if (ffa != null) {
      const prisma = new PrismaClient();

      await prisma.gameConfiguration.upsert({
        where: {
          key: 'ffa',
        },
        update: {
          value: 'true',
        },
        create: {
          key: 'ffa',
          value: 'true',
        },
      });

      return new NextResponse('Set FFA', { status: 200 });
    } else
      return Response.json(
        { error: 'Invalid game state or ffa' },
        { status: 400 }
      );
  } else return notFound();
}
