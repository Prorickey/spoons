import { PrismaClient } from '@prisma/client';

// We can do this because the spoonmaster is on the same server
// meaning the latency is very, very low
export async function GET() {
  const prisma = new PrismaClient()
  const status =
    await prisma.gameConfiguration.findUnique({
      where: {
        key: "status"
      }
    })

  return Response.json({ status: status })
}

export async function POST(request: Request) {
  const { state } = await request.json();

  if (["PREGAME", "RUNNING", "POSTGAME"].includes(state)) {
    // TODO: Implement this in golang
    return Response.json({ message: "Game state updated", state });
  }

  return Response.json({ error: "Invalid game state" }, { status: 400 });
}