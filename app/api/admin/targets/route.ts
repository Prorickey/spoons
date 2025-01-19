// /app/api/targets/route.ts
import { NextResponse } from "next/server";

// TODO: Create this in golang

let targetsAssigned = false; // Dummy target state
let targets: { player: string; target: string; hallId: string }[] = [];

export async function GET() {
  const data = [
    { player: "Player 1", target: "Player 2", hallId: "1H" },
    { player: "Player 2", target: "Player 3", hallId: "2WH" },
  ];
  return NextResponse.json({ targets: data, targetsAssigned });
}

export async function POST(request: Request) {
  const { action } = await request.json();

  if (action === "create") {
    // Mock target creation logic
    targets = [
      { player: "Player 1", target: "Player 2", hallId: "1H" },
      { player: "Player 2", target: "Player 3", hallId: "2WH" },
    ];
    targetsAssigned = true;
    return NextResponse.json({ message: "Targets created", targets });
  }

  if (action === "reshuffle") {
    // Mock reshuffle logic
    targets.reverse(); // Dummy reshuffle
    return NextResponse.json({ message: "Targets reshuffled", targets });
  }

  if (action === "clear") {
    targets = [];
    targetsAssigned = false;
    return NextResponse.json({ message: "Targets cleared", targets });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
