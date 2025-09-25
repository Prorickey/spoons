import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';

export async function GET() {
  const prisma = new PrismaClient();
  const status: FullGameStatus = { data: [] };

  const players = await prisma.user.findMany({
    include: {
      Kills: true,
    },
  });

  const session = await getServerSession(authOptions);

  for (const player of players) {
    // TODO: Create a better way of doing this
    if (player.email == 'barboriak25v@ncssm.edu') continue;

    const playerStatus: AnonPlayerObj = {
      nickname: player.nickname,
      alive: !player.killed,
      kills: player.Kills.length,
    };

    if (session /*&& session.user.gamemaster*/) {
      playerStatus.firstName = player.firstName;
      playerStatus.lastName = player.lastName;
    }

    status.data.push(playerStatus);
  }

  return NextResponse.json(status);
}

export interface FullGameStatus {
  data: AnonPlayerObj[];
}

export interface AnonPlayerObj {
  nickname: string;
  alive: boolean;
  kills: number;
  firstName?: string;
  lastName?: string;
}
