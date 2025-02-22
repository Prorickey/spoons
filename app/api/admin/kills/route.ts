import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { notFound } from 'next/navigation';
import { KillData } from '@/app/spoonmaster/dash';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session && session.user.gamemaster) {
    try {
      const kills: KillData[] = await prisma.kill.findMany({
        where: {
          createdAt: {
            gt: new Date(1740227915855)
          }
        },
        orderBy: { createdAt: 'desc' },
        include: {
          killer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          victim: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
      });
      return new Response(JSON.stringify({ kills }), { status: 200 });
    } catch (error) {
      console.error('Error fetching kills:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch kills' }), { status: 500 });
    }
  }
  return notFound();
}