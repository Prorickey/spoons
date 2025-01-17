import {gameStatusData} from "@/app/target/page";

// We can do this because the spoonmaster is on the same server
// meaning the latency is very, very low
export default async function GET() {
  const gameStatus: gameStatusData = await fetch(
    `${process.env.SPOONMASTER_HOST}:${process.env.SPOONMASTER_PORT}/status`)
    .then(res => res.json())

  return Response.json({ status: gameStatus.gamestate })
}