import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { startGame } from '@/lib/targetAssignment';

export async function GET() {
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

  const showRealNames = await prisma.gameConfiguration.findUnique({
    where: {
      key: 'show_real_names',
    },
  });

  return Response.json({
    status: status?.value,
    ffa: ffa?.value == 'true',
    showRealNames: showRealNames?.value === 'true',
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session && session.user.gamemaster) {
    const {
      state,
      ffa,
      showRealNames,
    }: { state?: string; ffa?: boolean; showRealNames?: boolean } =
      await request.json();

    if (state) {
      switch (state) {
        case 'PREGAME': {
          break;
        }

        case 'RUNNING': {
          const result = await startGame();
          if (result.success) {
            return new Response('Started Game', { status: 200 });
          } else {
            return Response.json({ error: result.error }, { status: 400 });
          }
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
    } else if (showRealNames != null) {
      await prisma.gameConfiguration.upsert({
        where: {
          key: 'show_real_names',
        },
        update: {
          value: String(showRealNames),
        },
        create: {
          key: 'show_real_names',
          value: String(showRealNames),
        },
      });

      return new NextResponse(
        showRealNames ? 'Real names shown' : 'Real names hidden',
        { status: 200 }
      );
    } else
      return Response.json(
        { error: 'Invalid game state or ffa' },
        { status: 400 }
      );
  } else return notFound();
}
