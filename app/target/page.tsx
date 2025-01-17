"use server";

import MyTargetWrapper from "@/app/target/targetPage";

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

export enum gameState {
  PREGAME = "PREGAME",
  RUNNING = "RUNNING",
  POSTGAME = "POSTGAME"
}

export interface gameStatusData {
  gamestate: gameState,
  gamemasters: string[]
}