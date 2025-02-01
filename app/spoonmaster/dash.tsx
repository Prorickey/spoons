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

interface targetRule {
  id: number;
  type: number; // 0 = "Target"
  player1id: number;
  player2id: number;
}

export function Dashboard() {
  const [gameState, setGameState] = useState("PREGAME");
  const [targets, setTargets] = useState<targetData[]>([]);
  const [selectedHall, setSelectedHall] = useState("");
  const [hallTargets, setHallTargets] = useState<targetData[]>([]);
  const [targetRules, setTargetRules] = useState<targetRule[]>([]);
  const [newRule, setNewRule] = useState({
    player1id: "",
    player2id: ""
  });

  const fetchTargetRules = async () => {
    const res = await fetch("/api/admin/targetRules");
    const data = await res.json();
    setTargetRules(data.rules);
  };

  const handleDeleteRule = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this rule?");
    if (!confirmed) return;

    await fetch(`/api/admin/targetRules`, { method: "DELETE", body:
    JSON.stringify({
      id: id
    })});
    fetchTargetRules();
  };

  const handleCreateRule = async () => {
    const { player1id, player2id } = newRule;
    if (!player1id || !player2id) {
      alert("Please select two players.");
      return;
    }

    const res = await fetch("/api/admin/targetRules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: 0, player1id: Number(player1id), player2id: Number(player2id) })
    });

    if (res.ok) {
      setNewRule({ player1id: "", player2id: "" });
      fetchTargetRules();
    } else {
      alert("Failed to create rule.");
    }
  };

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
    fetchTargetRules();
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

        {/* Target Rules Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Target Rules</h2>
          <table className="w-full border border-gray-600">
            <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-2 border border-gray-600">Type</th>
              <th className="p-2 border border-gray-600">Player 1</th>
              <th className="p-2 border border-gray-600">Player 2</th>
              <th className="p-2 border border-gray-600">Actions</th>
            </tr>
            </thead>
            <tbody>
            {targetRules.map((rule) => {
              const player1 = targets.find((t) => t.id === rule.player1id);
              const player2 = targets.find((t) => t.id === rule.player2id);

              return (
                <tr key={rule.id} className="border border-gray-600">
                  <td className="p-2 border border-gray-600">Target</td>
                  <td className="p-2 border border-gray-600">
                    {player1 ? `${player1.firstName} ${player1.lastName}` : "Unknown"}
                  </td>
                  <td className="p-2 border border-gray-600">
                    {player2 ? `${player2.firstName} ${player2.lastName}` : "Unknown"}
                  </td>
                  <td className="p-2 border border-gray-600">
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>

          {/* Create New Rule */}
          <div className="mt-4 flex gap-4">
            <select
              name="player1id"
              value={newRule.player1id}
              onChange={(e) => setNewRule({ ...newRule, player1id: e.target.value })}
              className="p-2 bg-gray-800 text-white border"
            >
              <option value="">Select Player 1</option>
              {targets.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.firstName} {player.lastName}
                </option>
              ))}
            </select>

            <select
              name="player2id"
              value={newRule.player2id}
              onChange={(e) => setNewRule({ ...newRule, player2id: e.target.value })}
              className="p-2 bg-gray-800 text-white border"
            >
              <option value="">Select Player 2</option>
              {targets.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.firstName} {player.lastName}
                </option>
              ))}
            </select>

            <button
              onClick={handleCreateRule}
              className="px-4 py-2 bg-green-600 text-white hover:bg-green-800 rounded"
            >
              Add Rule
            </button>
          </div>
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