import {gameStatusData} from "@/app/target/targetPage";

// We can do this because the spoonmaster is on the same server
// meaning the latency is very, very low
export async function GET() {
  const gameStatus: gameStatusData = await fetch(
    `http://${process.env.SPOONMASTER_HOST}:${process.env.SPOONMASTER_PORT}/status`)
    .then(res => res.json())

  return Response.json({ status: gameStatus.gamestate })
}

export async function POST(request: Request) {
  const { state } = await request.json();

  if (["PREGAME", "RUNNING", "POSTGAME"].includes(state)) {
    // TODO: Implement this in golang
    return Response.json({ message: "Game state updated", state });
  }

  return Response.json({ error: "Invalid game state" }, { status: 400 });
}