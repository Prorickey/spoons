import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';

export async function GET() {
  const status: FullGameStatus = { data: [] };

  const players = await prisma.user.findMany({
    where: { gamemaster: false },
    include: {
      Kills: true,
    },
  });

  const session = await getServerSession(authOptions);

  const showRealNamesConfig = await prisma.gameConfiguration.findUnique({
    where: { key: 'show_real_names' },
  });
  const showRealNames = session && showRealNamesConfig?.value === 'true';

  for (const player of players) {
    const playerStatus: AnonPlayerObj = {
      nickname: player.nickname,
      alive: !player.killed,
      kills: player.Kills.length,
    };

    if (showRealNames) {
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
