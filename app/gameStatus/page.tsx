"use client";

import { SessionProvider } from 'next-auth/react';
import { GameStatus } from '@/app/gameStatus/gamestatus';

export default function GameStatusPage() {
  return (
    <SessionProvider>
      <GameStatus />
    </SessionProvider>
  );
}