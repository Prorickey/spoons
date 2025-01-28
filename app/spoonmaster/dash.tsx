"use client";

import { useEffect, useState } from "react";
import NavBar, { NavbarProvider } from '@/app/navbar';
import { SessionProvider } from 'next-auth/react';
import {halls} from '@/app/api/auth/[...nextauth]/halls';

interface targetData {
  firstName: string,
  lastName: string,
  currentTarget: number,
  id: number,
  hallId: string
}

export function Dashboard() {
  const [gameState, setGameState] = useState("PREGAME");
  const [targets, setTargets] = useState<targetData[]>([]);
  const [selectedHall, setSelectedHall] = useState("");
  const [hallTargets, setHallTargets] = useState<targetData[]>([]);

  const [manualAccount, setManualAccount] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    hallId: "",
    grade: "",
    nickname: ""
  });

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

  const handleManualAccountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setManualAccount({ ...manualAccount, [name]: value });
  };

  const handleClearManualAccount = () => {
    setManualAccount({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      hallId: "",
      grade: "",
      nickname: ""
    });
  };

  const handleSaveManualAccount = async () => {
    const { firstName, lastName, email, phone, hallId, grade, nickname } = manualAccount;

    if (!firstName || !lastName || !email || !phone || !hallId || !grade || !nickname) {
      alert("Please fill out all fields before saving.");
      return;
    }

    try {
      const res = await fetch("/api/admin/createManualAccount", {
        method: "POST",
        body: JSON.stringify(manualAccount),
      });

      if (res.ok) {
        alert("Account created successfully!");
        handleClearManualAccount();
      } else {
        alert("Failed to create account. Please try again.");
      }
    } catch (error) {
      console.error("Error creating manual account:", error);
      alert("An error occurred. Please try again.");
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
      <NavbarProvider>
        <NavBar current={"dashboard"} />
      </NavbarProvider>
      <main className="p-8">
        <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>

        {/* Game State Controls */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Game State</h2>
          <p className="mb-1 text-lg">
            Number of players: <span className="font-bold">{targets.length}</span>
          </p>
          <p className="mb-4 text-lg">
            Current game state: <span className="font-bold">{gameState}</span>
          </p>
          <button
            onClick={handleGameStateAction}
            className="px-6 py-2 bg-gray-800 text-white border border-gray-600 hover:bg-gray-600 rounded"
          >
            {gameState === 'PREGAME' && 'Start Game'}
            {gameState === 'RUNNING' && 'End Game'}
            {gameState === 'POSTGAME' && 'Reset Game'}
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

        {/* Manual Account Creator */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Manual Account Creator</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              value={manualAccount.firstName}
              onChange={handleManualAccountChange}
              placeholder="First Name"
              className="p-2 bg-gray-800 text-white border"
            />
            <input
              type="text"
              name="lastName"
              value={manualAccount.lastName}
              onChange={handleManualAccountChange}
              placeholder="Last Name"
              className="p-2 bg-gray-800 text-white border"
            />
            <input
              type="text"
              name="nickname"
              value={manualAccount.nickname}
              onChange={handleManualAccountChange}
              placeholder="Nickname"
              className="p-2 bg-gray-800 text-white border"
            />
            <input
              type="email"
              name="email"
              value={manualAccount.email}
              onChange={handleManualAccountChange}
              placeholder="Email"
              className="p-2 bg-gray-800 text-white border"
            />
            <input
              type="text"
              name="phone"
              value={manualAccount.phone}
              onChange={handleManualAccountChange}
              placeholder="Phone Number"
              className="p-2 bg-gray-800 text-white border"
            />
            <select
              name="hallId"
              value={manualAccount.hallId}
              onChange={handleManualAccountChange}
              className="p-2 bg-gray-800 text-white border"
            >
              <option defaultValue="">Select a Hall</option>
              {halls.map((hall) => (
                <option key={hall.value} value={hall.value}>
                  {hall.label}
                </option>
              ))}
            </select>
            <select
              name="grade"
              value={manualAccount.grade}
              onChange={handleManualAccountChange}
              className="p-2 bg-gray-800 text-white border"
            >
              <option value="">Select a Grade</option>
              <option value="junior">Junior</option>
              <option value="senior">Senior</option>
            </select>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleSaveManualAccount}
              className="px-4 py-2 bg-green-600 text-white hover:bg-green-800 rounded"
            >
              Save
            </button>
            <button
              onClick={handleClearManualAccount}
              className="px-4 py-2 bg-red-600 text-white hover:bg-red-800 rounded"
            >
              Clear
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
            {hallTargets.map((player: targetData, index: number) => {

              const target = targets.find(d => d.id == player.currentTarget)

              return (
                <div
                  key={index}
                  className="p-4 border border-gray-600 mb-2 flex justify-between"
                >
                  <span>{player.firstName + " " + player.lastName}</span>
                  <span>{target != null ? target.firstName + " " + target.lastName : "No Target"}</span>
                </div>
              )
            })}
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