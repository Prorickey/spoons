// /app/api/targets/route.ts
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { notFound } from 'next/navigation';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session && session.user.gamemaster) {
    const prisma = new PrismaClient();

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

    if (action === 'create') {
      const res: { error: string | null; message: string | null } = await fetch(
        `http://${process.env.SPOONMASTER_HOST}:${process.env.SPOONMASTER_PORT}/assignTargets`,
        {
          method: 'POST',
          body: JSON.stringify({
            action: 'create',
          }),
        }
      ).then((res) => res.json());

      if (!res['error']) return Response.json({ message: 'Targets created' });
      else return Response.json({ error: res.error });
    }

    if (action === 'reshuffle') {
      const res: { error: string | null; message: string | null } = await fetch(
        `http://${process.env.SPOONMASTER_HOST}:${process.env.SPOONMASTER_PORT}/assignTargets`,
        {
          method: 'POST',
          body: JSON.stringify({
            action: 'reshuffle',
          }),
        }
      ).then((res) => res.json());

      if (!res['error'])
        return Response.json({ message: 'Targets reshuffled' });
      else return Response.json({ error: res.error });
    }

    if (action === 'clear') {
      const res: { error: string | null; message: string | null } = await fetch(
        `http://${process.env.SPOONMASTER_HOST}:${process.env.SPOONMASTER_PORT}/assignTargets`,
        {
          method: 'POST',
          body: JSON.stringify({
            action: 'clear',
          }),
        }
      ).then((res) => res.json());

      if (!res['error']) return Response.json({ message: 'Targets cleared' });
      else return Response.json({ error: res.error });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } else return notFound();
}
