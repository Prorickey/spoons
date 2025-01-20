import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';

export default async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if(session && session.user.gamemaster) {
    const prisma = new PrismaClient()

    const dbres = await prisma.user.create({
      data: await req.json()
    })

    return Response.json(dbres, { status: 200 })
  } else return notFound()
}