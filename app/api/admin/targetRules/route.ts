import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { notFound } from 'next/navigation';

// GET: Fetch all target rules
export async function GET() {
  const session = await getServerSession(authOptions);

  if (session && session.user.gamemaster) {
    const rules = await prisma.targetRules.findMany();
    return Response.json({ rules });
  } else return notFound();
}

// POST: Create a new target rule
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (session && session.user.gamemaster) {
    const { type, player1id, player2id } = await request.json();

    if (!player1id || !player2id) {
      return Response.json(
        { error: 'Both player1id and player2id are required' },
        { status: 400 }
      );
    }

    const newRule = await prisma.targetRules
      .create({
        data: {
          type,
          player1id,
          player2id,
        },
      })
      .catch((err) => {
        console.error('Error creating rule:', err.message);
        return Response.json(
          { error: 'Failed to create rule' },
          { status: 500 }
        );
      });

    return Response.json({
      message: 'Rule created successfully',
      rule: newRule,
    });
  } else return notFound();
}

// DELETE: Delete a target rule by ID
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (session && session.user.gamemaster) {
    const { id } = await request.json();

    if (!id) {
      return Response.json({ error: 'Rule ID is required' }, { status: 400 });
    }

    try {
      await prisma.targetRules.delete({
        where: { id },
      });

      return Response.json({ message: 'Rule deleted successfully' });
    } catch (error) {
      console.error('Error deleting rule:', error);
      return Response.json({ error: 'Failed to delete rule' }, { status: 500 });
    }
  } else return notFound();
}
