// /app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import NavBar from "@/app/navbar";
import { SessionProvider } from 'next-auth/react';
import {halls} from '@/app/api/auth/[...nextauth]/halls';

interface targetData {
  player: string,
  target: string,
  hallId: string
}

export function Dashboard() {
  const [gameState, setGameState] = useState("PREGAME");
  const [targets, setTargets] = useState<targetData[]>([]);
  const [selectedHall, setSelectedHall] = useState("");
  const [hallTargets, setHallTargets] = useState<targetData[]>([]);

  const fetchGameState = async () => {
    const res = await fetch("/api/status");
    const data = await res.json();
    setGameState(data.status);
  };

  const updateGameState = async (state: string) => {
    const actionText =
      state === "RUNNING"
        ? "start the game"
        : state === "POSTGAME"
          ? "end the game"
          : "reset the game";

    const confirmed = window.confirm(`Are you sure you want to ${actionText}?`);
    if (!confirmed) return;

    await fetch("/api/game-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state }),
    });
    setGameState(state);
  };

  const fetchTargets = async () => {
    const res = await fetch("/api/admin/targets");
    const data = await res.json();
    console.log(data)
    setTargets(Array.from(data.targets));
  };

  const handleTargetsAction = async (action: string) => {
    const actionText =
      action === "create"
        ? "create new targets"
        : action === "reshuffle"
          ? "reshuffle the targets"
          : "clear all targets";

    const confirmed = window.confirm(
      `Are you sure you want to ${actionText}? This action cannot be undone.`
    );
    if (!confirmed) return;
    
    await fetch("/api/admin/targets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    fetchTargets();
  };

  const handleGameStateAction = () => {
    if (gameState === "PREGAME") {
      updateGameState("RUNNING"); // Start the game
    } else if (gameState === "RUNNING") {
      updateGameState("POSTGAME"); // End the game
    } else if (gameState === "POSTGAME") {
      updateGameState("PREGAME"); // Reset the game
    }
  };

  useEffect(() => {
    fetchGameState();
    fetchTargets();
  }, []);

  useEffect(() => {
    const filteredTargets = targets.filter(
      (t) => t.hallId === selectedHall
    );
    setHallTargets(filteredTargets);
  }, [selectedHall, targets]);

  return (
    <div>
      <NavBar current={"dashboard"} />
      <main className="p-8">
        <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>

        {/* Game State Controls */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Game State</h2>
          <p className="mb-4 text-lg">
            Current game state: <span className="font-bold">{gameState}</span>
          </p>
          <button
            onClick={handleGameStateAction}
            className="px-6 py-2 bg-gray-800 text-white border border-gray-600 hover:bg-gray-600 rounded"
          >
            {gameState === "PREGAME" && "Start Game"}
            {gameState === "RUNNING" && "End Game"}
            {gameState === "POSTGAME" && "Reset Game"}
          </button>
        </div>

        {/* Targets Management */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Targets Management</h2>
          <div className="flex gap-4">
            <button
              onClick={() => handleTargetsAction("create")}
              className="px-4 py-2 bg-gray-800 hover:hover:bg-gray-600 text-white border"
            >
              Create Targets
            </button>
            <button
              onClick={() => handleTargetsAction("reshuffle")}
              className="px-4 py-2 bg-gray-800 hover:hover:bg-gray-600 text-white border"
            >
              Reshuffle Targets
            </button>
            <button
              onClick={() => handleTargetsAction("clear")}
              className="px-4 py-2 bg-gray-800 hover:hover:bg-gray-600 text-white border"
            >
              Clear Targets
            </button>
          </div>
        </div>

        {/* Hall Selector */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">View Targets by Hall</h2>
          <select
            value={selectedHall}
            onChange={(e) => setSelectedHall(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white"
          >
            <option value="">Select a Hall</option>
            {halls.map((hall) => (
              <option key={hall.value} value={hall.value}>
                {hall.label}
              </option>
            ))}
          </select>

          <div className="mt-4">
            {hallTargets.map((target: targetData, index: number) => (
              <div
                key={index}
                className="p-4 border border-gray-600 mb-2 flex justify-between"
              >
                <span>{target.player}</span>
                <span>{target.target}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardWrapper() {
  return (
    <SessionProvider>
      <Dashboard />
    </SessionProvider>
  )
}