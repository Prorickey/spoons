import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (session && session.user.gamemaster) {
    const prisma = new PrismaClient();

    const data = await req.json();

    await prisma.user
      .create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          grade: data.grade,
          hallId: data.hallId,
          nickname: data.nickname,
          email: data.email,
        },
      })
      .catch((err) => {
        console.log(err.message);
        return Response.json({ message: err.message }, { status: 500 });
      });

    return Response.json({ message: 'Success' }, { status: 200 });
  } else return notFound();
}
