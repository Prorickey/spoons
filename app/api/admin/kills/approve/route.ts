import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { notFound } from 'next/navigation';

// POST: Approve a kill by setting its approved field to true.
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (session && session.user.gamemaster) {
    try {
      const { id } = await request.json();
      if (!id)
        return new Response(JSON.stringify({ error: 'Kill id is required' }), {
          status: 400,
        });

      const updatedKill = await prisma.kill.update({
        where: { id },
        data: { approved: true },
      });

      return new Response(
        JSON.stringify({
          message: 'Kill approved successfully',
          kill: updatedKill,
        }),
        { status: 200 }
      );
    } catch (error) {
      console.error('Error approving kill:', error);
      return new Response(JSON.stringify({ error: 'Failed to approve kill' }), {
        status: 500,
      });
    }
  }

  return notFound();
}
