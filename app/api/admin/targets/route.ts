// /app/api/targets/route.ts
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { notFound } from 'next/navigation';
import {
  assignAndSaveTargets,
  clearTargets,
} from '@/lib/targetAssignment';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session && session.user.gamemaster) {
    const data = await prisma.user.findMany({
      select: {
        id: true,
        hallId: true,
        firstName: true,
        lastName: true,
        currentTarget: true,
      },
    });

    return Response.json({ targets: data });
  } else return notFound();
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (session && session.user.gamemaster) {
    const { action } = await request.json();

    if (action === 'create' || action === 'reshuffle') {
      try {
        await assignAndSaveTargets();
        return Response.json({
          message: action === 'create' ? 'Targets created' : 'Targets reshuffled',
        });
      } catch (error) {
        return Response.json(
          { error: error instanceof Error ? error.message : 'Unknown error' },
          { status: 500 }
        );
      }
    }

    if (action === 'clear') {
      try {
        await clearTargets();
        return Response.json({ message: 'Targets cleared' });
      } catch (error) {
        return Response.json(
          { error: error instanceof Error ? error.message : 'Unknown error' },
          { status: 500 }
        );
      }
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } else return notFound();
}
