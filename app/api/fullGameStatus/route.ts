import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
  const prisma = new PrismaClient()
  const status: FullGameStatus = { data: [] }

  const players = await prisma.user.findMany({
    include: {
      Kills: true
    }
  })

  for(const player of players) {
    status.data.push({
      nickname: player.nickname,
      alive: !player.killed,
      kills: player.Kills.length
    })
  }

  return NextResponse.json(status)
}

export interface FullGameStatus {
  data: AnonPlayerObj[]
}

export interface AnonPlayerObj {
  nickname: string,
  alive: boolean,
  kills: number
}