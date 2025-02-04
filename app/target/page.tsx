import { PrismaClient } from '@prisma/client';
import MyTargetWrapper from './targetPage';

export const dynamic = 'force-dynamic';

export default async function ServerMyTarget() {

  const prisma = new PrismaClient()

  const gameStatus: string | undefined = await prisma.gameConfiguration.findUnique({
    where: {
      key: "status"
    }
  }).then(res => res?.value)

  if(gameStatus && gameStatus == "RUNNING") return (
      <MyTargetWrapper />
    )
  else return (
    <h1>Game is not currently running</h1>
  )
}