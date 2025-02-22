import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

// POST: Revert a kill by resetting the victim's killed status and deleting the kill record.
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if(session && session.user.gamemaster) {
    try {
      const { id } = await request.json();
      if (!id)
        return new Response(JSON.stringify({ error: "Kill id is required" }), { status: 400 });

      // Find the kill record.
      const killRecord = await prisma.kill.findUnique({
        where: { id },
      });
      if (!killRecord)
        return new Response(JSON.stringify({ error: "Kill record not found" }), { status: 404 });

      // Reset the victim's killed status.
      await prisma.user.update({
        where: { id: killRecord.victimId },
        data: {
          killedBy: null,
          killed: false
        },
      });

      // Delete the kill record.
      await prisma.kill.delete({
        where: { id },
      });

      return new Response(JSON.stringify({ message: "Kill reverted successfully" }), { status: 200 });
    } catch (error) {
      console.error("Error reverting kill:", error);
      return new Response(JSON.stringify({ error: "Failed to revert kill" }), { status: 500 });
    }
  }

  return notFound();
}