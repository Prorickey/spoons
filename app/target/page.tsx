import MyTargetWrapper, { gameState, gameStatusData } from './targetPage';

export const dynamic = 'force-dynamic';

export default async function ServerMyTarget() {

  const gameStatus: gameStatusData = await fetch(
    `${process.env.SPOONMASTER_HOST}:${process.env.SPOONMASTER_PORT}/status`)
    .then(res => res.json())

  if(gameStatus.gamestate == gameState.RUNNING) return (
      <MyTargetWrapper />
    )
  else return (
    <h1>Game is not currently running</h1>
  )
}