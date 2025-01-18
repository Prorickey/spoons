import {gameStatusData} from "@/app/target/targetPage";

// We can do this because the spoonmaster is on the same server
// meaning the latency is very, very low
export async function GET() {
  try {
    const gameStatus: gameStatusData = await fetch(
      `${process.env.SPOONMASTER_HOST}:${process.env.SPOONMASTER_PORT}/status`)
      .then(res => res.json())

    return Response.json({ status: gameStatus.gamestate })
  } catch(e) {
    console.error(e)
    return Response.json({ status: "PREGAME" })
  }
}