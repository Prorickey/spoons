import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { notFound } from 'next/navigation';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if(session) {

    if(session.user.killed) return new NextResponse(
      "You have already been eliminated from the game", {
        status: 450
      })

    const data = await request.json();
    const prisma = new PrismaClient()

    let lastKill;
    try {
      lastKill = await prisma.kill.findFirst({
        where: {
          killerId: session.user.id
        },
        orderBy: {
          createdAt: "desc"
        }
      })
    } catch {
      return new NextResponse("Internal error (1)", { status: 500 })
    }

    if(lastKill && lastKill.createdAt.getMilliseconds() < (Date.now()-1000*60*60*6)) return new NextResponse(
      "You must wait 6 hours since your last kill submission to submit another", {
        status: 450
      })

    if(!session.user.currentTarget) return new NextResponse(
      "Error finding your target. Contact the spoonmaster to resolve. (1)", {
        status: 500
      })

    let victim;
    try {
      victim = await prisma.user.findFirst({
        where: {
          id: parseInt(session.user.currentTarget)
        }
      })
    } catch {
      return new NextResponse("Internal error (2)", { status: 500 })
    }

    if(!victim) return new NextResponse(
      "Error finding your target. Contact the spoonmaster to resolve. (2)", {
        status: 500
      })

    let error = false;

    // Update current target first since that's important for the flow of the game
    await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        currentTarget: victim.currentTarget
      }
    }).catch(() => error = true)

    await prisma.user.update({
      where: {
        id: victim.id
      },
      data: {
        killed: true,
        killedBy: session.user.id.toString()
      }
    }).catch(() => error = true)

    await prisma.kill.create({
      data: {
        killerId: session.user.id,
        victimId: victim.id,
        killedAt: data.date,
        lat: data.lat,
        long: data.lng
      }
    }).catch(() => error = true)

    if(error) new NextResponse("Internal Error (3)", { status: 500 })
    return new NextResponse("OK", { status: 200 })
  } else return notFound()
}